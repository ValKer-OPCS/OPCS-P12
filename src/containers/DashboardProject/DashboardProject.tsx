"use client";

import { useEffect, useState } from "react";
import AdminProjectCard from "../../components/AdminProjectCard/AdminProjectCard";
import AdminModalDelete from "../../components/AdminModalDelete/AdminModalDelete";
import AdminModalUpdater from "../../components/AdminModalUpdater/AdminModalUpdater";
import AdminModalUploader from "../../components/AdminModalUploader/AdminModalUploader";
import styles from "./style.module.scss";

export type Project = {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  github?: string;
  demo?: string;
  date?: string;
  technologies?: string[];
  hero: boolean;
  thumbnail: {
    original: string;
    responsive: { name: string; width: number; url: string }[];
  };
};

export default function DashboardProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<Project | null>(null);

  const [modalCreateOpen, setModalCreateOpen] = useState(false);

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
      if (!token) return console.error("JWT manquant");

      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hero: !currentHero }),
      });

      const json = await res.json();
      if (!json.success) return;

      setProjects((prev) =>
        prev.map((p) => (p._id === id ? json.data : p))
      );
    } catch (err) {
      console.error("Erreur toggle hero", err);
    }
  };

  const queryDelete = (id: string) => {
    setProjectToDelete(id);
    setModalDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("JWT manquant");

      await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects((prev) =>
        prev.filter((p) => p._id !== projectToDelete)
      );
    } catch (err) {
      console.error("Erreur suppression", err);
    }

    setModalDeleteOpen(false);
    setProjectToDelete(null);
  };

  const openUpdateModal = (project: Project) => {
    setProjectToUpdate(project);
    setModalUpdateOpen(true);
  };

  if (loading) return <p>Chargement…</p>;

  return (
    <>
      <div className={styles.dashboardActions}>
        <h1 className={styles.title}>Gestion des projets</h1>

        <button className={styles.addBtn} onClick={() => setModalCreateOpen(true)}>
          <span>+</span> Ajouter un projet
        </button>
      </div>


      <div className={styles.grid}>
        {projects.map((project) => (
          <AdminProjectCard key={project._id} _id={project._id} title={project.title} shortDescription={project.shortDescription}
            thumbnail={project.thumbnail} hero={project.hero} onToggleHero={handleToggleHero} onDelete={queryDelete} onEdit={() => openUpdateModal(project)} />
        ))}
      </div>

      <AdminModalDelete open={modalDeleteOpen} title="Supprimer ce projet ?" message="Cette action est irréversible."
                        onCancel={() => setModalDeleteOpen(false)} onConfirm={confirmDelete} />

      {modalUpdateOpen && projectToUpdate && (
        <AdminModalUpdater project={projectToUpdate} onClose={() => setModalUpdateOpen(false)} onUpdated={(updated) => {
            setProjects((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p))
            );
            setModalUpdateOpen(false);
          }}
        />
      )}

      {modalCreateOpen && (
        <AdminModalUploader
          onClose={() => setModalCreateOpen(false)}
          onCreated={(newProject) => {
            setProjects((prev) => [newProject, ...prev]);
            setModalCreateOpen(false);
          }}
        />
      )}
    </>
  );
}
