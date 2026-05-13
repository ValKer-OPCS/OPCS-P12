"use client";

import { useEffect, useState } from "react";
import AdminProjectCard from "../../components/AdminProjectCard/AdminProjectCard";
import AdminModalDelete from '../../components/AdminModalDelete/AdminModalDelete'
import styles from "./style.module.scss";

type Project = {
  _id: string;
  title: string;
  shortDescription: string;
  thumbnail: {
    original: string;
    responsive: { name: string; width: number; url: string }[];
  };
  hero: boolean;
};

export default function ProjectsContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.success) setProjects(json.data);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

const handleToggleHero = async (id: string, currentHero: boolean) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("JWT manquant");
      return;
    }

    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ hero: !currentHero })
    });

    const json = await res.json();
    if (!json.success) return;

    setProjects(prev =>
      prev.map(p => (p._id === id ? json.data : p))
    );
  } catch (err) {
    console.error("Erreur toggle hero", err);
  }
};


const queryDelete = (id: string) => {
    setProjectToDelete(id);
    setModalOpen(true);
  };


    const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT manquant");
        return;
      }

      await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      setProjects(prev => prev.filter(p => p._id !== projectToDelete));
    } catch (err) {
      console.error("Erreur suppression", err);
    }

    setModalOpen(false);
    setProjectToDelete(null);
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin/projects/edit/${id}`;
  };

  if (loading) return <p>Chargement…</p>;

  return (

    <>
    <div className={styles.grid}>
      {projects.map(project => (
        <AdminProjectCard key={project._id} _id={project._id} title={project.title} shortDescription={project.shortDescription}
                          thumbnail={project.thumbnail} hero={project.hero} onToggleHero={handleToggleHero} onDelete={queryDelete}
                          onEdit={handleEdit} />
      ))}
    </div>

       <AdminModalDelete  open={modalOpen} title="Supprimer ce projet ?" message="Cette action est irréversible."
                          onCancel={() => setModalOpen(false)} onConfirm={confirmDelete} />

    </>
  );
}
