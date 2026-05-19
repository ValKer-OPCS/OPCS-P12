import { NextResponse } from "next/server";
import path from "path";
import { unlink } from "fs/promises";
import ProjectModel from "@/models/Project";

type CarouselImage = {
  original: string;
  responsive: {
    name: string;
    width: number;
    url: string;
  }[];
};

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ filename: string }> }
) => {
  try {
    const { filename } = await context.params;

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "projectId requis" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");


    const originalPath = path.join(uploadDir, filename);
    await unlink(originalPath).catch(() => {});

    const base = filename.replace(".webp", "");

    const responsiveFiles = [
      `${base}-sm.webp`,
      `${base}-md.webp`,
      `${base}-lg.webp`
    ];

    for (const file of responsiveFiles) {
      const filePath = path.join(uploadDir, file);
      await unlink(filePath).catch(() => {});
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    if (type === "thumbnail") {
      if (project.thumbnail?.original.endsWith(filename)) {
        project.thumbnail = null;
      }
    }

    if (type !== "thumbnail") {
      project.carouselImages = project.carouselImages.filter(
        (img: CarouselImage) => !img.original.endsWith(filename)
      );
    }

    await project.save();

    const updated = await ProjectModel.findById(projectId).lean();

    return NextResponse.json({
      success: true,
      project: updated
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erreur suppression" },
      { status: 500 }
    );
  }
};