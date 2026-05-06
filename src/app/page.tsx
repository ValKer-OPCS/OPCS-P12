import styles from "./page.module.scss";

import Header from "@/containers/Header/Header";
import Footer from "@/containers/Footer/Footer";
import AboutMe from "@/containers/AboutMe/AboutMe";
import Projects from "@/containers/Projects/Projects";
import HeroProjects from "@/containers/HeroProject/HeroProject";
import Contact from "@/containers/Contact/Contact";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>

        <AboutMe />

        <HeroProjects />

        <Projects />

        <Contact />

      </main>
      <Footer />
    </div>
  );
}
