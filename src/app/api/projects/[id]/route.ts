export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";


export const GET = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  try {
    await dbConnect();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
};


export const PATCH = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  try {
    await dbConnect();
    const body = await req.json();

    const updated = await Project.findByIdAndUpdate(id, body, { returnDocument: "after" });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
};


export const DELETE = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  try {
    await dbConnect();
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
};
