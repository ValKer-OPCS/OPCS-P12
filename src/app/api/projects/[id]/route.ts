export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import { supabase } from "@/lib/supabase";

export const DELETE = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  try {
    await dbConnect();
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    const pathsToDelete: string[] = [];

    if (project.thumbnail) {
      if (project.thumbnail.originalPath) {
        pathsToDelete.push(project.thumbnail.originalPath);
      }

      if (Array.isArray(project.thumbnail.responsive)) {
        for (const img of project.thumbnail.responsive) {
          if (img.path) pathsToDelete.push(img.path);
        }
      }
    }

    if (Array.isArray(project.carouselImages)) {
      for (const img of project.carouselImages) {
        if (img.originalPath) {
          pathsToDelete.push(img.originalPath);
        }

        if (Array.isArray(img.responsive)) {
          for (const r of img.responsive) {
            if (r.path) pathsToDelete.push(r.path);
          }
        }
      }
    }

    if (pathsToDelete.length > 0) {
      const { error } = await supabase.storage
        .from("portfolio")
        .remove(pathsToDelete);

      if (error) {
        console.error("Supabase delete error:", error);
      }
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
};
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await dbConnect();

    const body = await req.json();

    const updated = await Project.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH error:", err);
    return Response.json({ success: false, error: "PATCH failed" }, { status: 500 });
  }
}


