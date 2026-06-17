export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username !== process.env.ADMIN_USERNAME) {
    return NextResponse.json(
      {
        success: false,
        message: "Identifiants invalides",
      },
      { status: 401 }
    );
  }

  const isValidPassword = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD!
  );

  if (!isValidPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Identifiants invalides",
      },
      { status: 401 }
    );
  }

  const accessToken = jwt.sign(
    { role: "admin" },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { role: "admin" },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}