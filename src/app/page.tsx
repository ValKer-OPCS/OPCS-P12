import styles from "./page.module.scss";


import AboutMe from "@/containers/AboutMe/AboutMe";
import Projects from "@/containers/Projects/Projects";
import HeroProjects from "@/containers/HeroProject/HeroProject";
import Contact from "@/containers/Contact/Contact";

export default function Home() {
  return (
    <div className={styles.page}>

      <main className={styles.main}>

        <AboutMe />

        <HeroProjects />

        <Projects />

        <Contact />

      </main>

    </div>
  );
}
