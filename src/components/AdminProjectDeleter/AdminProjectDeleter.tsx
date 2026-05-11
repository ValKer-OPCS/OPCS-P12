"use client";

import { useState } from "react";
import styles from "./style.module.scss";

export default function DeleteProjectForm() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Token manquant : vous devez être connecté");
      return;
    }

    if (!id.trim()) {
      setMessage("Veuillez entrer un ID");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMessage(data.message || (data.success ? "Projet supprimé" : "Erreur"));
    } catch {
      setMessage("Erreur réseau");
    }
  };

  return (
    <form onSubmit={handleDelete} className={styles.deleteForm}>
      <h2>Supprimer un projet</h2>

      <label>
        ID du projet
        <input
          type="text"
          placeholder="ex: 65f0c1a2b3..."
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>

      <button type="submit">Supprimer</button>

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}
