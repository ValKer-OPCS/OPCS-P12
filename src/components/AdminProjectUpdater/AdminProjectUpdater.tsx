"use client";

import { useState } from "react";
import styles from "./style.module.scss";

type UpdateFields = {
  title: string;
  shortDescription: string;
  longDescription: string;
  github: string;
  demo: string;
  date: string;
  hero: boolean;
  technologies: string;
};

type UpdateFieldKey = keyof UpdateFields;

const AdminProjectUpdater = () => {
  const [id, setId] = useState("");
  const [fields, setFields] = useState<UpdateFields>({
    title: "",
    shortDescription: "",
    longDescription: "",
    github: "",
    demo: "",
    date: "",
    hero: false,
    technologies: "",
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFields({ ...fields, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Token manquant : vous devez être connecté");
      setStatus("error");
      return;
    }

    if (!id.trim()) {
      setMessage("Veuillez entrer un ID");
      setStatus("error");
      return;
    }

    const body: Record<string, unknown> = {};

    (Object.entries(fields) as [UpdateFieldKey, string | boolean][]).forEach(
      ([key, value]) => {

        if (key === "hero") {
          if (value === true) body[key] = true;
          return;
        }

        if (key === "technologies") {
          if (typeof value === "string" && value.trim() !== "") {
            body[key] = value.split(",").map((t: string) => t.trim());
          }
          return;
        }


        if (key === "date") {
          if (typeof value === "string" && value.trim() !== "") {
            body[key] = new Date(value);
          }
          return;
        }

        if (typeof value === "string" && value.trim() !== "") {
          body[key] = value;
        }
      }
    );

    if (Object.keys(body).length === 0) {
      setMessage("Aucun champ à mettre à jour");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Erreur");
        setStatus("error");
        return;
      }

      setMessage("Projet mis à jour");
      setStatus("success");
    } catch {
      setMessage("Erreur réseau");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleUpdate} className={styles.updateForm}>
      <h2>Modifier un projet</h2>

      <label>
        ID du projet
        <input
          type="text"
          placeholder="ex: 6a0186a4f6b2e3512eacc8b8"
          value={id}
          onChange={(e) => setId(e.target.value.trim())}
        />
      </label>

      <label>
        Nouveau titre
        <input
          name="title"
          value={fields.title}
          onChange={handleChange}
          placeholder="Laisser vide pour ne pas modifier"
        />
      </label>

      <label>
        Nouvelle courte description
        <input
          name="shortDescription"
          value={fields.shortDescription}
          onChange={handleChange}
          placeholder="Laisser vide pour ne pas modifier"
        />
      </label>

      <label>
        Nouvelle longue description
        <textarea
          name="longDescription"
          value={fields.longDescription}
          onChange={handleChange}
          placeholder="Laisser vide pour ne pas modifier"
        />
      </label>

      <label>
        Nouveau lien GitHub
        <input
          name="github"
          value={fields.github}
          onChange={handleChange}
          placeholder="Laisser vide pour ne pas modifier"
        />
      </label>

      <label>
        Nouveau lien Demo
        <input
          name="demo"
          value={fields.demo}
          onChange={handleChange}
          placeholder="Laisser vide pour ne pas modifier"
        />
      </label>

      <label>
        Nouvelle date
        <input
          type="date"
          name="date"
          value={fields.date}
          onChange={handleChange}
        />
      </label>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="hero"
          checked={fields.hero}
          onChange={handleChange}
        />
        Mettre en avant (hero)
      </label>

      <label>
        Technologies (séparées par des virgules)
        <input
          name="technologies"
          value={fields.technologies}
          onChange={handleChange}
          placeholder="ex: React, Next.js, TypeScript"
        />
      </label>

      <button type="submit">Mettre à jour</button>

      {message && (
        <p
          className={`${styles.message} ${
            status === "success"
              ? styles.success
              : status === "error"
              ? styles.error
              : ""
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default AdminProjectUpdater;
