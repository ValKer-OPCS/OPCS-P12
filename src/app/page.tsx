import styles from "./page.module.scss";

import AboutMe from "@/containers/AboutMe/AboutMe";
import Projects from "@/containers/Projects/Projects";
import HeroProjects from "@/containers/HeroProject/HeroProject";
import Contact from "@/containers/Contact/Contact";
import { Project } from "@/types/project";
import Skills from "@/containers/Skills/Skills";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch projects");

  const json = await res.json();
  return json.data;
}


export default async function Home() {
  const projects = await getProjects();

  const heroProjects = projects.filter((p) => p.hero);


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AboutMe />

        <Skills />
        <HeroCarousel projects={heroProjects} />

        <HeroProjects projects={heroProjects} />

        <Projects projects={projects} />

        <Contact />
      </main>
    </div>
  );
}
