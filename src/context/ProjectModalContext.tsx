"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Project = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  technologies: string[];
  github: string | null;
  demo: string | null;
  thumbnail: string;
  carouselImages?: string[];
  date: number;
};

type ModalContextType = {
  project: Project | null;
  openModal: (project: Project) => void;
  closeModal: () => void;
};

const ProjectModalContext = createContext<ModalContextType | undefined>(undefined);

export const ProjectModalProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProject] = useState<Project | null>(null);


  const openModal = (project: Project) => {
    setProject(project);
  };

  const closeModal = () => {
    setProject(null);
  };


  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [project]);

  return (
    <ProjectModalContext.Provider value={{ project, openModal, closeModal }}>
      {children}
    </ProjectModalContext.Provider>
  );
};

export const useProjectModal = () => {
  const ctx = useContext(ProjectModalContext);
  if (!ctx) {
    throw new Error("useProjectModal must be used within a ProjectModalProvider");
  }
  return ctx;
};
