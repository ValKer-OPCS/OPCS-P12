export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  const { username, password } = await req.json();

  if (username !== process.env.ADMIN_USERNAME) {
    return NextResponse.json(
      { success: false, message: "Identifiants invalides" },
      { status: 401 }
    );
  }

  const isValidPassword = await bcrypt.compare( password, process.env.ADMIN_PASSWORD!
  );

  if (!isValidPassword) {
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
};
