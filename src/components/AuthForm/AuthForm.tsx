"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./style.module.scss";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h1 className={styles.title}>Connexion admin</h1>

        <div className={styles.field}>
          <label className={styles.label}>
            Nom d&apos;utilisateur
          </label>

          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Mot de passe
          </label>

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className={styles.button} >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}