"use client";

import styles from "./style.module.scss";
import Carousel from "../Carousel/Carousel";
import { Project } from "@/types/project";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <div data-testid="modal-overlay" className={styles.overlay} onClick={onClose} >
      <div data-testid="modal-content" className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>{project.title}</h2>

        <p className={styles.description}>{project.longDescription}</p>

        <ul className={styles.techList}>
          {project.technologies.map((tech: string) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <Carousel images={project.carouselImages ?? ["/placeholder.webp"]} />
      </div>
    </div>
  );
};

export default ProjectModal;
