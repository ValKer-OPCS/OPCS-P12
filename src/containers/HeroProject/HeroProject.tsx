"use client";

import { useState } from "react";
import HeroCard from "@/components/HeroCard/HeroCard";
import ProjectModal from "@/components/ProjectModal/ProjectModal";
import { Project } from "@/types/project";
import styles from "./style.module.scss";

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

      <div className={styles.projectsContainer}>
        {projects.map((project) => (
          <HeroCard key={project._id} project={project} openModal={openModal} />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </section>
  );
};

export default HeroProjects;
