import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: Request) => {
  try {
    const { name, email, message, companyName, gdprConsent, userAgent } =
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


    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      tls: {
    rejectUnauthorized: false},
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      subject: `Nouveau message de ${name}`,
      text: `
            Nom : ${name}
            Email : ${email}
            Entreprise : ${companyName || "Non renseignée"}
            Consentement RGPD : ${gdprConsent ? "Oui" : "Non"}
            User Agent : ${userAgent}

            Message :
            ${message}
      `,
      html: `
        <h2>Nouveau message reçu</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Entreprise :</strong> ${companyName || "Non renseignée"}</p>
        <p><strong>Consentement RGPD :</strong> ${gdprConsent ? "Oui" : "Non"}</p>
        <p><strong>User Agent :</strong> ${userAgent}</p>
        <h3>Message :</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    };

    await transporter.sendMail(mailOptions);

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
