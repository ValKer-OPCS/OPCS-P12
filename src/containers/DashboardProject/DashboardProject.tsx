"use client";

import { useEffect, useState } from "react";
import AdminProjectCard from "../../components/AdminProjectCard/AdminProjectCard";
import AdminModalDelete from "../../components/AdminModalDelete/AdminModalDelete";
import AdminModalUpdater from "../../components/AdminModalUpdater/AdminModalUpdater";
import AdminModalUploader from "../../components/AdminModalUploader/AdminModalUploader";
import AdminModalImages from "../../components/AdminModalImages/AdminModalImages";
import styles from "./style.module.scss";
import { Project } from "@/types/project";

export default function DashboardProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<Project | null>(null);

  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const [modalImagesOpen, setModalImagesOpen] = useState(false);
  const [projectToEditImages, setProjectToEditImages] = useState<Project | null>(null);


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

      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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

  const handleDeleteSuccess = (deletedId: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== deletedId));
    setModalDeleteOpen(false);
    setProjectToDelete(null);
  };

  const openUpdateModal = (project: Project) => {
    setProjectToUpdate(project);
    setModalUpdateOpen(true);
  };

  const openImagesModal = (id: string) => {
    const project = projects.find((p) => p._id === id);
    if (!project) return;

    setProjectToEditImages(project);
    setModalImagesOpen(true);
  };

  const handleImagesUpdated = (updated: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
  };

  if (loading) return <p>Chargement…</p>;

  return (
    <>
      <div className={styles.dashboardActions}>
        <h2 className={styles.title}>Gestion des projets</h2>

        <button className={styles.addBtn} onClick={() => setModalCreateOpen(true)}>
          <span>+</span> Ajouter un projet
        </button>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <AdminProjectCard key={project._id} _id={project._id}
            title={project.title} shortDescription={project.shortDescription} thumbnail={project.thumbnail ?? { original: "/placeholder.webp", responsive: [] }} hero={project.hero}
            onToggleHero={handleToggleHero} onDelete={queryDelete} onEdit={() => openUpdateModal(project)} onEditImages={openImagesModal}
          />
        ))}
      </div>

      <AdminModalDelete open={modalDeleteOpen} projectId={projectToDelete} onCancel={() => setModalDeleteOpen(false)} onSuccess={handleDeleteSuccess} />

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
        <AdminModalUploader onClose={() => setModalCreateOpen(false)} onCreated={(newProject) => {
          setProjects((prev) => [newProject, ...prev]); setModalCreateOpen(false);
        }} />
      )}

      {modalImagesOpen && projectToEditImages && (
        <AdminModalImages project={projectToEditImages} onClose={() => setModalImagesOpen(false)} onUpdated={handleImagesUpdated} />
      )}
    </>
  );
}
