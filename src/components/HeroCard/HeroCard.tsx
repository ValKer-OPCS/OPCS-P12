"use client";

import Carousel from "../Carousel/Carousel";
import styles from "./style.module.scss";
import { Project } from "@/types/project";

interface HeroCardProps {
  project: Project;
  openModal: (project: Project) => void;
}

const HeroCard = ({ project, openModal }: HeroCardProps) => {


  return (
    <article className={styles.card} onClick={() => openModal(project)} role="button" tabIndex={0} >
      <div>
        <Carousel images={ project.carouselImages?.length ? project.carouselImages : [{ original: "/placeholder.webp" }]} />
      </div>

      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.longDescription}</p>

      <ul className={styles.techList}>
        {project.technologies?.map((tech: string) => (
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

export default HeroCard;
