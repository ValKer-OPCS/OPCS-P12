/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "./style.module.scss";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  openModal: (project: Project) => void;
}

const ProjectCard = ({ project, openModal }: ProjectCardProps) => {
  const original = project.thumbnail?.original || "/placeholder.webp";
  const responsive = project.thumbnail?.responsive || [];

  const srcSet = responsive
    .map((img) => `${img.url} ${img.width}w`)
    .join(", ");

  const sizes = "(max-width: 768px) 100vw, 768px";


  const alt = `${project.title} - aperçu du projet`;

  return (
    <article data-testid="project-card" className={styles.card} onClick={() => openModal(project)} role="button" tabIndex={0} >
      <div className={styles.imageWrapper}>
        <img src={original} srcSet={srcSet || undefined} sizes={srcSet ? sizes : undefined} alt={alt} className={styles.image} loading="lazy" data-testid="project-thumbnail" />
      </div>

      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.shortDescription}</p>

      <ul className={styles.techList}>
        {project.technologies?.map((tech) => (
          <li key={tech} className={styles.techItem}>
            {tech}
          </li>
        ))}
      </ul>

      <div className={styles.links}>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} >
            GitHub
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} >
            Demo
          </a>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
