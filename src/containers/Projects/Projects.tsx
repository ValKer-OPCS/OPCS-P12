"use client"

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ProjectsList from "@/data/projects.json";
import styles from "./style.module.scss";

const Projects = () => {
  const projects = useMemo(() => ProjectsList.projects, []);

  const allTechnologies = useMemo( () =>
      Array.from( new Set(projects.flatMap((p) => p.technologies))),
    [projects]
  );

  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projects;
    return projects.filter((p) => p.technologies.includes(selectedTech));
  }, [projects, selectedTech]);

  return (
    <section data-testid="projects-section" id="projects" className={styles.section}>
      <h2 data-testid="projects-container" className={styles.projectsContainerTitle}>Projects</h2>

      <div className={styles.filters}>
        <button className={!selectedTech ? styles.active : ""} onClick={() => setSelectedTech(null)}>
          Tous
        </button>

        {allTechnologies.map((tech) => (
          <button key={tech} className={selectedTech === tech ? styles.active : ""} onClick={() => setSelectedTech(tech)} >
            {tech}
          </button>
        ))}
      </div>

      <div className={styles.projectsContainer}>
        {filteredProjects.map((project) => ( <ProjectCard key={project.id} project={project} /> ))}
      </div>
    </section>
  );
};

export default Projects;
