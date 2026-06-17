import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const accessToken =
      req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    );

    return NextResponse.json({
      authenticated: true,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}