"use client";

import React, { useState } from "react";
import styles from "./style.module.scss";
import { Project } from "@/types/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface AdminModalUploaderProps {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

const AdminModalUploader: React.FC<AdminModalUploaderProps> = ({ onClose, onCreated }) => {
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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const res = await fetch("/api/projects", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        shortDescription,
        longDescription,
        technologies,
        github,
        demo,
        date: date ? date : undefined,
        hero: false,
      }),
    });

    const data = await res.json();

    if (data.success) {
      onCreated(data.data);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.uploader} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Créer un projet</h2>
          <button data-testid="close-button" className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Titre du projet
            <input required type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
          </label>

          <label>
            Slug
            <input required type="text" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
          </label>

          <label>
            Courte description
            <textarea required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
          </label>

          <label>
            Longue description
            <textarea required value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
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

          <button type="submit" className={styles.uploadBtn}>
            Enregistrer le projet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminModalUploader;
