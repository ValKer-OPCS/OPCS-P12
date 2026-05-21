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

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    const companyName = (form.elements.namedItem("companyName") as HTMLInputElement)?.value || null;
    const gdprConsent = (form.elements.namedItem("gdprConsent") as HTMLInputElement).checked;
    const secondaryEmail = (form.elements.namedItem("secondaryEmail") as HTMLInputElement).value;

    const data = { name, email, message, companyName, gdprConsent, userAgent: navigator.userAgent, secondaryEmail };

    try {
      const res = await fetch("/api/messages", {
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

      <label className={style.label2}>
        <input type="text" name="secondaryEmail" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
        <span>Secondary Contact</span>
      </label>


      <label className={style.label}>
        <span>Nom</span>
        <input type="text" name="name" required className={style.input} />
      </label>

      <label className={style.label}>
        <span>Email</span>
        <input type="email" name="email" required className={style.input} />
      </label>

      <label className={style.label}>
        <span>Entreprise (optionnel)</span>
        <input type="text" name="companyName" className={style.input} />
      </label>

      <label htmlFor="messageLabel" className={style.label}>
        <span>Message</span>
        <textarea id="messageLabel" name="message" required className={style.textarea} />
      </label>

      <label htmlFor="rgpd" className={style.checkbox}>
        <input id="rgpd" type="checkbox" name="gdprConsent" required aria-label="gdpr consent" />
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
