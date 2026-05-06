export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Message from "@/models/Message";

export const POST = async (req: Request) => {
  try {
    await dbConnect();

    const { name, email, message, companyName, gdprConsent } =
      await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    if (gdprConsent !== true) {
      return NextResponse.json(
        { success: false, message: "Le consentement RGPD est obligatoire." },
        { status: 400 }
      );
    }

    const saved = await Message.create({
      name,
      email,
      message,
      companyName: companyName || "",
      gdprConsent,
      isRead: false,
    });

    return NextResponse.json(
      { success: true, data: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
};