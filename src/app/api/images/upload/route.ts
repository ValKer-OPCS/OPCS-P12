export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const sizes = [
  { name: "sm", width: 480 },
  { name: "md", width: 1024 },
  { name: "lg", width: 1600 }
];

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier reçu" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const baseName = file.name.split(".")[0];

    const filename = `${Date.now()}-${baseName}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");

    await mkdir(uploadDir, { recursive: true });

    const originalFilename = `${filename}.webp`;
    const originalPath = path.join(uploadDir, originalFilename);

    await sharp(buffer)
      .rotate()
      .webp({
        quality: 80
      })
      .toFile(originalPath);


    const responsive = await Promise.all(
      sizes.map(async ({ name, width }) => {
        const responsiveFilename = `${filename}-${name}.webp`;

        const responsivePath = path.join( uploadDir, responsiveFilename );

        await sharp(buffer)
          .rotate()
          .resize({
            width, withoutEnlargement: true
          })
          .webp({
            quality: 80
          })
          .toFile(responsivePath);

        return {
          name, width, url: `/uploads/${responsiveFilename}`
        };
      })
    );

    return NextResponse.json({
      success: true,
      image: { original: { url: `/uploads/${originalFilename}` }, responsive }
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Erreur upload" },
      { status: 500 }
    );
  }
};