"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./style.module.scss";
import { Project } from "@/types/project";



interface Props {
    projects: Project[];
}

export default function HeroCarousel({ projects }: Props) {
    const [index, setIndex] = useState(0);

    const current = projects[index];

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % projects.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [projects.length]);

    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <div className={styles.carousel}>
            <div className={styles.slide}>
                <div className={styles.imageWrapper}>
                    <Image src={current.thumbnail?.original ?? "/placeholder.webp"} fill alt={current.title}
                         className={styles.image} />
                </div>

                <div className={styles.text}>
                    <h2>{current.title}</h2>

                    <p>{current.shortDescription}</p>

                    <button className={styles.button}>
                        Découvrir
                    </button>
                </div>
            </div>

            <div className={styles.labels}>
                {projects.map((p, i) => (
                    <button key={p._id} onClick={() => setIndex(i)} className={`${styles.label} ${i === index ? styles.active : ""}`} >
                        {p.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
