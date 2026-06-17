"use client";

import { useState } from "react";
import styles from "./style.module.scss";
import { Project } from "@/types/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface AdminModalUpdaterProps {
  project: Project | null;
  onClose: () => void;
  onUpdated: (updated: Project) => void;
}

const AdminModalUpdater = ({ project, onClose, onUpdated }: AdminModalUpdaterProps) => {


  const [fields, setFields] = useState(() => ({
    title: project?.title ?? "",
    shortDescription: project?.shortDescription ?? "",
    longDescription: project?.longDescription ?? "",
    github: project?.github ?? "",
    demo: project?.demo ?? "",
    date: project?.date ? String(project.date).substring(0, 10) : "",
    hero: project?.hero ?? false,
    technologies: project?.technologies?.join(", ") ?? "",
  }));

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  if (!project) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFields((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus("");

    const body: Record<string, unknown> = {};

    if (fields.title.trim()) body.title = fields.title.trim();
    if (fields.shortDescription.trim()) body.shortDescription = fields.shortDescription.trim();
    if (fields.longDescription.trim()) body.longDescription = fields.longDescription.trim();
    if (fields.github.trim()) body.github = fields.github.trim();
    if (fields.demo.trim()) body.demo = fields.demo.trim();

    if (fields.date.trim()) {
      body.date = new Date(fields.date);
    }

    body.hero = fields.hero;

    body.technologies = fields.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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

      const updated: Project = {
        ...data.data,
        date: data.data.date ? data.data.date.substring(0, 10) : "",
      };

      onUpdated(updated);
    } catch {
      setMessage("Erreur réseau");
      setStatus("error");
    }
  };


  return (
    <div className={styles.overlay}>
      <form className={styles.updateForm} onClick={(e) => e.stopPropagation()} onSubmit={handleUpdate} >

        <button data-testid="close-button" type="button" className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2>Modifier un projet</h2>

        <label>
          Titre
          <input name="title" value={fields.title} onChange={handleChange} />
        </label>

        <label>
          Courte description
          <input name="shortDescription" value={fields.shortDescription} onChange={handleChange} />
        </label>

        <label>
          Longue description
          <textarea name="longDescription" value={fields.longDescription} onChange={handleChange} />
        </label>

        <label>
          GitHub
          <input name="github" value={fields.github} onChange={handleChange} />
        </label>

        <label>
          Demo
          <input name="demo" value={fields.demo} onChange={handleChange} />
        </label>

        <label>
          Date
          <input type="date" name="date" value={fields.date} onChange={handleChange} />
        </label>

        <label>
          Technologies
          <input name="technologies" value={fields.technologies} onChange={handleChange} />
        </label>

        <label className={styles.checkbox}>
          <input type="checkbox" name="hero" checked={fields.hero} onChange={handleChange} />
          Mettre en avant
        </label>

        <button type="submit">Mettre à jour</button>

        {message && (
          <p className={`${styles.message} ${status === "success" ? styles.success : status === "error" ? styles.error : ""}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminModalUpdater;
