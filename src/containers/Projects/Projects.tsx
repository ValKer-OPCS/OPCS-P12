"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ProjectsList from "@/data/projects.json";
import ProjectModal from "@/components/ProjectModal/ProjectModal";
import styles from "./style.module.scss";
import { Project } from "@/types/project";

const Projects = () => {
  const projects: Project[] = useMemo(() => ProjectsList.projects, []);

  const allTechnologies = useMemo( () => Array.from(new Set(projects.flatMap((p) => p.technologies))),
  [projects]
  );

  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projects;
    return projects.filter((p) => p.technologies.includes(selectedTech));
  }, [projects, selectedTech]);

  const openModal = (project: Project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  return (
    <section data-testid="projects-section" id="projects" className={styles.projectSection}>
      <h2 className={styles.projectsContainerTitle}>Projects</h2>

      <div className={styles.filters}>
        <button className={!selectedTech ? styles.active : ""} onClick={() => setSelectedTech(null)} >
          Tous
        </button>

        {allTechnologies.map((tech: string) => (
          <button key={tech} className={selectedTech === tech ? styles.active : ""} onClick={() => setSelectedTech(tech)} >
            {tech}
          </button>
        ))}
      </div>

      <div className={styles.projectsContainer}>
        {filteredProjects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} openModal={openModal} />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </section>
  );
};

export default Projects;
