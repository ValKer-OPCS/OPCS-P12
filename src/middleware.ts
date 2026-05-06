import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = pathname.startsWith("/api/messages");


  if (isProtected && req.method === "POST") {
    return NextResponse.next();
  }

  if (!isProtected) return NextResponse.next();

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
  matcher: ["/api/messages/:path*"],
};
