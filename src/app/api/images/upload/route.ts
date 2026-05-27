export const runtime = "nodejs";

import { NextResponse } from "next/server";
import sharp from "sharp";
import ProjectModel from "@/models/Project";
import { supabase } from "@/lib/supabase";

const sizes = [
  { name: "sm", width: 480 },
  { name: "md", width: 1024 },
  { name: "lg", width: 1600 },
];

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    if (!projectId || !type) {
      return NextResponse.json(
        { success: false, message: "projectId et type requis" },
        { status: 400 }
      );
    }

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

    const filename = Date.now().toString();

    const optimizedBuffer = await sharp(buffer)
      .rotate()
      .webp({ quality: 80 })
      .toBuffer();

    const originalPath = `projects/${projectId}/${filename}.webp`;

    const { error: originalUploadError } = await supabase.storage
      .from("portfolio")
      .upload(originalPath, optimizedBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (originalUploadError) throw originalUploadError;

    const { data: originalPublic } = supabase.storage
      .from("portfolio")
      .getPublicUrl(originalPath);

    const responsive = await Promise.all(
      sizes.map(async ({ name, width }) => {
        const resizedBuffer = await sharp(buffer)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const responsivePath = `projects/${projectId}/${filename}-${name}.webp`;

        const { error } = await supabase.storage
          .from("portfolio")
          .upload(responsivePath, resizedBuffer, {
            contentType: "image/webp",
            upsert: false,
          });

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(responsivePath);

        return {
          name,
          width,
          url: publicData.publicUrl,
          path: responsivePath,
        };
      })
    );

    const imageSet = {
      original: originalPublic.publicUrl,
      originalPath,
      responsive,
    };

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    if (type === "thumbnail") {
      project.thumbnail = imageSet;
    }

    if (type === "carousel") {
      project.carouselImages.push(imageSet);
    }

    await project.save();

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erreur upload" },
      { status: 500 }
    );
  }
};
