"use client";

import React, { useState } from "react";
import styles from "./style.module.scss";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface AdminModalUploaderProps {
  onClose: () => void;
}

const AdminModalUploader: React.FC<AdminModalUploaderProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [date, setDate] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return console.error("Token manquant");

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        slug,
        shortDescription,
        longDescription,
        technologies,
        github,
        demo,
        date
      })
    });

    console.log(await res.json());
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.uploader} onClick={(e) => e.stopPropagation()} >
        <div className={styles.header}>
          <h2>Créer un projet</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <label>
          Titre du projet
          <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
        </label>

        <label>
          Slug (auto-généré, modifiable)
          <input type="text" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
        </label>

        <label>
          Courte description
          <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </label>

        <label>
          Longue description
          <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        </label>

        <label>
          Technologies (séparées par des virgules)
          <input type="text" onChange={(e) => setTechnologies(e.target.value.split(",").map((t) => t.trim()))} />
        </label>

        <label>
          Lien GitHub
          <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} />
        </label>

        <label>
          Lien de démo
          <input type="text" value={demo} onChange={(e) => setDemo(e.target.value)} />
        </label>

        <label>
          Date du projet
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <button className={styles.uploadBtn} onClick={handleSubmit}>
          Enregistrer le projet
        </button>
      </div>
    </div>
  );
};

export default AdminModalUploader;
