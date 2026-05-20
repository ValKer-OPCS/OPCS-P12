"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.scss";

import { Project } from "@/types/project";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash , faTimes } from "@fortawesome/free-solid-svg-icons";

type ResponsiveImage = {
  name: string;
  width: number;
  url: string;
};

type Thumbnail = {
  original: string;
  responsive: ResponsiveImage[];
} | null;

type CarouselImage = {
  original: string;
  responsive: ResponsiveImage[];
};

type Props = {
  project: Project;
  onClose: () => void;
  onUpdated: (updated: Project) => void;
};

const AdminProjectImagesModal = ({ project, onClose, onUpdated }: Props) => {
  const [thumbnail, setThumbnail] = useState<Thumbnail>(project.thumbnail ?? null);
  const [carousel, setCarousel] = useState<CarouselImage[]>(project.carouselImages ?? []);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token;
  };

  const uploadImage = async (file: File, type: "thumbnail" | "carousel") => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `/api/images/upload?projectId=${project._id}&type=${type}`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: formData
      }
    );

    return res.json();
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setLoading(true);
    const result = await uploadImage(e.target.files[0], "thumbnail");
    setLoading(false);

    if (result.success) {
      setThumbnail(result.project.thumbnail);
      setCarousel(result.project.carouselImages);
      onUpdated(result.project);
    }
  };

  const handleCarouselUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setLoading(true);
    const result = await uploadImage(e.target.files[0], "carousel");
    setLoading(false);

    if (result.success) {
      setThumbnail(result.project.thumbnail);
      setCarousel(result.project.carouselImages);
      onUpdated(result.project);
    }
  };

  const deleteThumbnail = async () => {
    if (!thumbnail) return;

    const token = getToken();
    const filename = thumbnail.original.split("/").pop();
    if (!filename) return;

    await fetch(`/api/images/${filename}?projectId=${project._id}&type=thumbnail`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    });

    setThumbnail(null);
  };

  const deleteCarouselImage = async (url: string) => {
    const token = getToken();
    const filename = url.split("/").pop();
    if (!filename) return;

    await fetch(`/api/images/${filename}?projectId=${project._id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    });

    setCarousel((prev) => prev.filter((img) => img.original !== url));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} disabled={loading}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        <h2>Modifier les images</h2>


        <h3>Thumbnail</h3>

        {thumbnail ? (
          <div className={styles.thumbnailWrapper}>
            <Image src={thumbnail.original} alt="thumbnail" width={300} height={200} className={styles.preview}/>

            <button className={styles.deleteIcon} onClick={deleteThumbnail} >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ) : (
          <p>Aucun thumbnail</p>
        )}

        <div className={styles.fileInput}>
          <input type="file" accept="image/*" disabled={!!thumbnail} className={thumbnail ? styles.disabledInput : ""} onChange={handleThumbnailUpload} />
        </div>


        <h3>Images du carousel</h3>

        <div className={styles.carouselGrid}>
          {carousel.map((img, i) => (
            <div key={i} className={styles.carouselItem}>
              <div className={styles.imageWrapper}>
                <Image src={img.original} alt={`carousel-${i}`} width={200} height={200} className={styles.carouselImage} />

                <button className={styles.deleteIcon} onClick={() => deleteCarouselImage(img.original)} >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleCarouselUpload} />
        </div>

        <div className={styles.actions}>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectImagesModal;
