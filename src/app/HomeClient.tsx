import dynamic from "next/dynamic";
import Skills from "@/containers/Skills/Skills";
import AboutMe from "@/containers/AboutMe/AboutMe";
import styles from "./page.module.scss";
import { Project } from "@/types/project";

const HeroProjects = dynamic(
  () => import("@/containers/HeroProject/HeroProject"),
  {
    loading: () => <div style={{ height: 300 }} />,
  }
);

const Projects = dynamic(
  () => import("@/containers/Projects/Projects"),
  {
    loading: () => <div style={{ height: 400 }} />,
  }
);

const Contact = dynamic(
  () => import("@/containers/Contact/Contact"),
  {
    loading: () => <div style={{ height: 200 }} />,
  }
);

export default function HomeClient({
  projects,
  heroProjects,
}: {
  projects: Project[];
  heroProjects: Project[];
}) {
  return (
    <div className={styles.page}>

      <main className={styles.main}>

        <AboutMe />

        <Skills />

        <HeroProjects projects={heroProjects} />

        <Projects projects={projects} />

        <Contact />

      </main>

    </div>
  );
}
