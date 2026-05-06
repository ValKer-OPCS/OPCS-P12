import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = [
  { path: "/api/auth", method: "ALL" },
  { path: "/api/projects", method: "GET" },
  { path: "/api/messages", method: "POST" },
];

const isPublic = (pathname: string, method: string) =>
  PUBLIC_ROUTES.some(route => {
    const matchPath =
      pathname === route.path ||
      pathname.startsWith(route.path + "/");

    const matchMethod =
      route.method === "ALL" || route.method === method;

    return matchPath && matchMethod;
  });

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (isPublic(pathname, method)) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }
};

export const config = {
  matcher: ["/api/:path*"],
};