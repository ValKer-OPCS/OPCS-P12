export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { success: false, message: "Identifiants invalides" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  return NextResponse.json({ success: true, token });
}
