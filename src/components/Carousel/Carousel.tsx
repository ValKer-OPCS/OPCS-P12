"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from "react";
import styles from "./style.module.scss";
import { ImageSet } from "@/types/project";

type CarouselProps = {
  images: ImageSet[];
  alt?: string;
};

type PreparedImage = {
  src: string;
  srcSet?: string;
  alt: string;
};

const Carousel = ({ images, alt = "Image du projet" }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  const preparedImages: PreparedImage[] = useMemo(() => {
    if (!images || images.length === 0) {
      return [
        { src: "/placeholder.webp", srcSet: undefined,  alt: "Image indisponible", },
      ];
    }

    return images.map((img, i) => {
      const src = img.responsive?.[0]?.url || img.original;

      const srcSet = img.responsive
        ?.map((r) => `${r.url} ${r.width}w`)
        .join(", ");

      return {
        src,
        srcSet,
        alt: `${alt} – image ${i + 1}`,
      };
    });
  }, [images, alt]);

  const hasMultiple = preparedImages.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setIndex((i) => (i === 0 ? preparedImages.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setIndex((i) => (i === preparedImages.length - 1 ? 0 : i + 1));
  };

  const current = preparedImages[index];

  return (
    <div className={styles.carousel}>
      {hasMultiple && (
        <button className={styles.navLeft} onClick={prev}>‹</button>
      )}

      <div className={styles.imageWrapper}>
        <img src={current.src} srcSet={current.srcSet} sizes="(max-width: 768px) 100vw, 700px" alt={current.alt} className={styles.image} loading="eager" />
      </div>

      {hasMultiple && (
        <button className={styles.navRight} onClick={next}>›</button>
      )}

      {hasMultiple && (
        <div className={styles.dots} onClick={(e) => e.stopPropagation()}>
          {preparedImages.map((_, i) => (
            <span role="button" key={i} className={`${styles.dot} ${i === index ? styles.active : ""}`} onClick={() => setIndex(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
