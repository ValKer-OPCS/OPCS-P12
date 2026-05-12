export const runtime = "nodejs";

import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import nodemailer from "nodemailer";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


const redis = Redis.fromEnv();
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1m"),
});


const sanitize = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();


const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  message: z.string().min(10).max(2000),
  companyName: z.string().max(200).optional(),
  gdprConsent: z.boolean(),
  userAgent: z.string().optional(),
  secondaryEmail: z.string().optional()
});

export const POST = async (req: Request) => {
  try {

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { success: allowed } = await limiter.limit(ip);

    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Trop de tentatives, réessayez plus tard." },
        { status: 429 }
      );
    }


    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Données invalides." },
        { status: 400 }
      );
    }

    const { name, email, message, companyName, gdprConsent, userAgent, secondaryEmail } =
      parsed.data;

    if (secondaryEmail && secondaryEmail.length > 0) {
      return NextResponse.json(
        { success: false, message: "Requête invalide." },
        { status: 400 }
      );
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { success: false, message: "Requête invalide." },
        { status: 400 }
      );
    }

    if (/[\r\n]/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Requête invalide." },
        { status: 400 }
      );
    }


    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanMessage = sanitize(message);
    const cleanCompany = sanitize(companyName || "");
    const cleanUA = sanitize(userAgent || "");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      subject: `Nouveau message de ${cleanName}`,
      text: `
            Nom : ${cleanName}
            Email : ${cleanEmail}
            Entreprise : ${cleanCompany}
            Consentement RGPD : Oui
            User Agent : ${cleanUA}

            Message :
            ${cleanMessage}
            `
    });

    return NextResponse.json(
      { success: true, message: "Email envoyé avec succès." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API message:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
};
