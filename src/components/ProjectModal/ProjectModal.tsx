"use client";

import { useProjectModal } from "@/context/ProjectModalContext";
import styles from "./style.module.scss";
import Carousel from "../Carousel/Carousel";

const ProjectModal = () => {
  const { project, closeModal } = useProjectModal();

  if (!project) return null;

  return (
    <div data-testid="modal-overlay" className={styles.overlay} onClick={closeModal}>
      <div data-testid="modal-content" className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <button className={styles.close} onClick={closeModal}>✕</button>


        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.description}>{project.longDescription}</p>

        <ul className={styles.techList}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <Carousel images={project.carouselImages ?? ["/placeholder.webp"]} />
      </div>
    </div>
  );
};

export default ProjectModal;
