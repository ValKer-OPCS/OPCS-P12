import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // --- PUBLIC ---
  if (pathname === "/api/messages" && method === "POST") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/projects") && method === "GET") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  // --- PROTECTED ---
  const protectedRoutes = [
    "/api/messages",
    "/api/projects",
    "/api/images"
  ];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // --- AUTH JWT ---
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return new NextResponse("Invalid token", { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/messages/:path*",
    "/api/projects/:path*",
    "/api/images/:path*",
    "/api/auth/:path*"
  ]
};
