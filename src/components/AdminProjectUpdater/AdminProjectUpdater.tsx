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
  technologies: string; // champ texte contenant toutes les tech
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

  const loadProject = async () => {
    if (!id.trim()) {
      setMessage("Veuillez entrer un ID");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();

      if (!data.success || !data.data) {
        setMessage("Projet introuvable");
        setStatus("error");
        return;
      }

      const p = data.data;

      setFields({
        title: p.title || "",
        shortDescription: p.shortDescription || "",
        longDescription: p.longDescription || "",
        github: p.github || "",
        demo: p.demo || "",
        date: p.date ? p.date.substring(0, 10) : "",
        hero: p.hero || false,
        technologies: p.technologies?.join(", ") || "",
      });

      setMessage("Projet chargé");
      setStatus("success");
    } catch {
      setMessage("Erreur lors du chargement du projet");
      setStatus("error");
    }
  };

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

  const handleUpdate = async (e: React.FormEvent) => {
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
          body[key] = value;
          return;
        }

        if (key === "technologies") {
          const text = value as string;

          if (text.trim() === "") {
            body[key] = [];
            return;
          }

          body[key] = text.split(",").map((t: string) => t.trim());
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

      <button type="button" onClick={loadProject}>
        Charger le projet
      </button>

      <label>
        Nouveau titre
        <input
          name="title"
          value={fields.title}
          onChange={handleChange}
        />
      </label>

      <label>
        Nouvelle courte description
        <input
          name="shortDescription"
          value={fields.shortDescription}
          onChange={handleChange}
        />
      </label>

      <label>
        Nouvelle longue description
        <textarea
          name="longDescription"
          value={fields.longDescription}
          onChange={handleChange}
        />
      </label>

      <label>
        Nouveau lien GitHub
        <input
          name="github"
          value={fields.github}
          onChange={handleChange}
        />
      </label>

      <label>
        Nouveau lien Demo
        <input
          name="demo"
          value={fields.demo}
          onChange={handleChange}
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
          checked={fields.hero === true}
          onChange={() => setFields({ ...fields, hero: true })}
        />
        Mettre en avant (hero = true)
      </label>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={fields.hero === false}
          onChange={() => setFields({ ...fields, hero: false })}
        />
        Ne pas mettre en avant (hero = false)
      </label>

      <label>
        Technologies (séparées par des virgules)
        <input
          name="technologies"
          value={fields.technologies}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Mettre à jour</button>

      {message && (
        <p
          className={`${styles.message} ${status === "success"
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
