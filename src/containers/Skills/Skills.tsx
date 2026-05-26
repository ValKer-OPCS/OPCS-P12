"use client";

import { motion } from "framer-motion";
import style from "./style.module.scss";

import skillsData from "@/data/skills.json";

import { FaReact, FaNodeJs, FaSass } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiMongodb } from "react-icons/si";

export default function Skills() {
  const iconsMap: Record<string, React.ReactNode> = {
    react: <FaReact />,
    next: <SiNextdotjs />,
    ts: <SiTypescript />,
    sass: <FaSass />,
    node: <FaNodeJs />,
    mongo: <SiMongodb />
  };

  return (
    <section id="skills" className={style.skillsSection}>
      <h2 className={style.title}>Compétences</h2>

      <div className={style.grid}>
        {skillsData.map((skill, index) => (
          <motion.div key={skill.name} className={style.card} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }} viewport={{ once: true }} >
            <div className={style.icon}>
              {iconsMap[skill.icon]}
            </div>

            <h3>{skill.name}</h3>
            <p>{skill.level}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
