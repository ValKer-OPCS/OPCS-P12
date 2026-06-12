export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import { supabase } from "@/lib/supabase";
import { projectUpdateSchema } from '@/utils/zodProjectValidation'

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
  await dbConnect();

  const { id } = await context.params;

  const body = await req.json();

  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation échouée", errors: parsed.error.format() },
      { status: 400 }
    );
  }

  try {
    const updated = await Project.findByIdAndUpdate(
      id,
      parsed.data,
      { returnDocument: "after" }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Projet mis à jour",
      data: updated
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

