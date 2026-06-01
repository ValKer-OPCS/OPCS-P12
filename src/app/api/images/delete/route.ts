import { NextResponse, NextRequest } from "next/server";
import Project from "@/models/Project";
import { removeFiles } from "@/lib/supabaseHelpers";

type DeleteImageBody = {
  originalPath: string;
  responsive: string[];
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    let body: DeleteImageBody = {
      originalPath: "",
      responsive: [],
    };

    try {
      body = await req.json();
    } catch {
    }

    const { originalPath, responsive } = body;

    if (!projectId || !originalPath) {
      return NextResponse.json(
        { success: false, error: "missing data" },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const pathsToDelete: string[] = [
      originalPath,
      ...responsive,
    ];

    await removeFiles(pathsToDelete);

    if (type === "thumbnail") {
      project.thumbnail = null;
    }

    if (type === "carousel") {
      project.carouselImages = project.carouselImages.filter(
        (img: { originalPath: string }) => img.originalPath !== originalPath
      );

    }

    await project.save();

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
};
