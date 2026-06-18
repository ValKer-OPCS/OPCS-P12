import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const publicRoutes = [
  { path: "/api/auth", method: "POST" },
  { path: "/api/projects", method: "GET" },
  { path: "/api/messages", method: "POST" },
];

const isPublic = (pathname: string, method: string) =>
  publicRoutes.some((route) => {
    const matchPath =
      pathname === route.path ||
      pathname.startsWith(route.path + "/");

    return matchPath && route.method === method;
  });

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname, req.method)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

    return NextResponse.next();
  } catch (error) {

    if (!(error instanceof TokenExpiredError)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      const payload = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET!
      ) as {
        role: string;
      };

      const newAccessToken = jwt.sign(
        { role: payload.role, },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m", }
      );

      const response = NextResponse.next();

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });

      return response;
    } catch {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
  }
}

export const config = {
  matcher: ["/api/:path*"],
};