"use client";

import { useState } from "react";
import ProjectModal from "@/components/ProjectModal/ProjectModal";
import { Project } from "@/types/project";
import styles from "./style.module.scss";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";

interface HeroProjectsProps {
  projects: Project[];
}

const HeroProjects = ({ projects }: HeroProjectsProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  return (
    <section data-testid="hero-projects" id="heroProjects" className={styles.heroSection} >
      <h2 className={styles.projectsContainerTitle}>Projets mis en avant</h2>

      <HeroCarousel projects={projects} onSelect={openModal} />

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </section>
  );
};

export default HeroProjects;
