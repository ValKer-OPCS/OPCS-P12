export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "Aucun fichier reçu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur upload" }, { status: 500 });
  }
};