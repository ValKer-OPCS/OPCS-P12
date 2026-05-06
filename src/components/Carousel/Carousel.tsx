"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.scss";

type CarouselProps = {
  images: string[];
  alt?: string;
};

const Carousel = ({ images, alt = "carousel image" }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  const hasMultiple = images.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className={styles.carousel}>
      {hasMultiple && (
        <button className={styles.navLeft} onClick={prev}>‹</button>
      )}

      <div className={styles.imageWrapper}>
        <Image src={images[index]} alt={alt} fill sizes="(max-width: 768px) 100vw, 700px" className={styles.image} loading="eager" priority />
      </div>

      {hasMultiple && (
        <button className={styles.navRight} onClick={next}>›</button>
      )}
      {hasMultiple && (
        <div className={styles.dots} onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <span role="button" key={i} className={`${styles.dot} ${i === index ? styles.active : ""}`} onClick={() => setIndex(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
