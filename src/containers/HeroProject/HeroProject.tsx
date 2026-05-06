"use client"
import HeroCard from "@/components/HeroCard/HeroCard";
import HeroProject from "@/data/heroProject.json";
import styles from "./style.module.scss";

const HeroProjects = () => {

  return (
    <section data-testid="hero-projects" id="heroProjects" className={styles.section}>
      <h2 className={styles.projectsContainerTitle}>Projets mis en avant</h2>


      <div className={styles.projectsContainer}>
        {HeroProject.projects.map((project) => ( <HeroCard key={project.id} project={project} /> ))}
      </div>


    </section>
  );
};

export default HeroProjects;
