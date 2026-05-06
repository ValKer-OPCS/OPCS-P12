"use client";

import { useState } from "react";
import style from "./style.module.scss";
import { getHttpErrorMessage } from "@/utils/handleHttpError";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      companyName: (form.elements.namedItem("companyName") as HTMLInputElement)?.value || null,
      gdprConsent: (form.elements.namedItem("gdprConsent") as HTMLInputElement).checked,
      userAgent: navigator.userAgent
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

       if (!res.ok) {
        const message = getHttpErrorMessage(res.status);
        throw new Error(message);
      }

      setSuccess(true);
      form.reset();
    } catch (err) {
       setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form role="form" onSubmit={handleSubmit} className={style.form}>
      <label className={style.label}>
        <span>Nom</span>
        <input type="text" name="name" required className={style.input} />
      </label>

      <label className={style.label}>
        <span>Email</span>
        <input type="email" name="email" required className={style.input} />
      </label>

      <label className={style.label}>
        <span>Entreprise (optionel)</span>
        <input type="text" name="companyName" className={style.input} />
      </label>

      <label className={style.label}>
        <span>Message</span>
        <textarea name="message" required className={style.textarea} />
      </label>

      <label className={style.checkbox}>
        <input type="checkbox" name="gdprConsent" required aria-label="gdpr consent" />
        <span>J&apos;accepte que mes données soient utilisées pour être recontacté.</span>
      </label>

      <button role="button" type="submit" disabled={loading} className={style.button}>
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </button>

      {success && <p className={style.success}>Message envoyé !</p>}
      {error && <p className={style.error}>{error}</p>}
    </form>
  );
};

export default ContactForm;
