export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";

export const GET = async () => {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export const POST = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();

    const project = await Project.create({
      ...body,
      thumbnail: null,
      carouselImages: []
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err) {
    console.error("Erreur backend:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
};
