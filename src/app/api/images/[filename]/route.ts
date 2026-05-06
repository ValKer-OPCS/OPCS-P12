export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export const DELETE = async (_: Request, { params }: { params: { filename: string } }) => {
  try {
    const filepath = path.join(process.cwd(), "public/uploads", params.filename);

    await unlink(filepath);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Image introuvable" }, { status: 404 });
  }
};