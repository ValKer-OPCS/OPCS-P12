"use client";

import Carousel from '../Carousel/Carousel';
import styles from './style.module.scss'

import { useProjectModal } from "@/context/ProjectModalContext";
import { Project } from "@/context/ProjectModalContext"


const HeroCard = ({ project }: { project: Project}) => {
  const { openModal } = useProjectModal();

    return (
        <article className={styles.card} onClick={() => openModal(project)} role="button" tabIndex={0}>
            <div>
                <Carousel images={project.carouselImages ?? ["/placeholder.webp"]} />
            </div>

            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.longDescription}</p>

            <ul className={styles.techList}>
                {project.technologies.map((tech) => (
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
    )
};

export default HeroCard
