export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Message from "@/models/Message";

// GET /api/messages/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const message = await Message.findById(params.id);

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("GET /messages/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

// PUT /api/messages/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const body = await req.json();

    const updated = await Message.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Message introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /messages/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/:id
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const deleted = await Message.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Message introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /messages/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
