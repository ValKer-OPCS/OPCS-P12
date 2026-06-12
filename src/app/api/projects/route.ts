export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import { projectSchema } from "@/utils/zodProjectValidation";

export const GET = async () => {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json( { success: false, message: "Erreur serveur" }, { status: 500 });
  }
};


export const POST = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();

    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation échouée", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const project = await Project.create({
      ...parsed.data,
      thumbnail: null,
      carouselImages: []
    });

    return NextResponse.json(
      {
        success: true,
        message: "Projet créé",
        data: project
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Erreur backend:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
};
