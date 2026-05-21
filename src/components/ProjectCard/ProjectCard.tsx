"use client";

import Image from "next/image";
import styles from "./style.module.scss";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  openModal: (project: Project) => void;
}



const ProjectCard = ({ project, openModal }: ProjectCardProps) => {

  const thumbnail = project.thumbnail?.responsive?.[0]?.url || project.thumbnail?.original || "/placeholder.webp";

  return (
    <article data-testid="project-card" className={styles.card} onClick={() => openModal(project)} role="button" tabIndex={0} >
      <div className={styles.imageWrapper}>
        <Image src={thumbnail} alt={project.title} fill className={styles.image} />
      </div>

      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.shortDescription}</p>

      <ul className={styles.techList}>
        {project.technologies?.map((tech: string) => (
          <li key={tech} className={styles.techItem}>
            {tech}
          </li>
        ))}
      </ul>

      <div className={styles.links}>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            GitHub
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            Demo
          </a>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
