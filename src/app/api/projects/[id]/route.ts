export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";

// GET public
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH admin (modification partielle)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();

    const updated = await Project.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE admin
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deleted = await Project.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
