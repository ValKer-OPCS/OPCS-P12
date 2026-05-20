"use client";

import Image from "next/image";
import styles from "./style.module.scss";

type ResponsiveImage = {
  name: string;
  width: number;
  url: string;
};

type Thumbnail = {
  original: string;
  responsive: ResponsiveImage[];
};

type CardProjectProps = {
  _id: string;
  title: string;
  shortDescription: string;
  thumbnail: Thumbnail;
  hero: boolean;
  onToggleHero: (id: string, currentHero: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onEditImages: (id: string) => void;
};

const AdminProjectCard = ({
  _id,
  title,
  shortDescription,
  thumbnail,
  hero,
  onToggleHero,
  onDelete,
  onEdit,
  onEditImages
}: CardProjectProps) => {

  const thumb = thumbnail?.responsive?.[0]?.url || thumbnail?.original || "/placeholder.webp";

  return (
    <div className={styles.card}>
      {thumb && (
        <div className={styles.thumbnail}>
          <Image src={thumb} alt={title} width={400} height={250} className={styles.image} />
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{shortDescription}</p>
      </div>

      <div className={styles.actions}>
        <button className={`${styles.iconButton} ${hero ? styles.active : ""}`} onClick={() => onToggleHero(_id, hero)}>
          ★
        </button>

        <button className={styles.iconButton} onClick={() => onEdit(_id)}>
          ✎
        </button>

        <button className={styles.iconButton} onClick={() => onEditImages(_id)} >
          🖼
        </button>

        <button className={styles.iconButton} onClick={() => onDelete(_id)}>
          🗑
        </button>
      </div>
    </div>
  );
};

export default AdminProjectCard;
