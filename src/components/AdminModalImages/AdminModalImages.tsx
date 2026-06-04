"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.scss";

import { Project } from "@/types/project";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

type ResponsiveImage = {
  name: string;
  width: number;
  url: string;
  path: string;
};

type Thumbnail = {
  original: string;
  originalPath: string;
  responsive?: ResponsiveImage[];
} | null;

type CarouselImage = {
  original: string;
  originalPath: string;
  responsive?: ResponsiveImage[];
};

type Props = {
  project: Project;
  onClose: () => void;
  onUpdated: (updated: Project) => void;
};

const AdminProjectImagesModal = ({ project, onClose,  onUpdated, }: Props) => {
  const [thumbnail, setThumbnail] = useState<Thumbnail>(
    project.thumbnail ?? null
  );

  const [carousel, setCarousel] = useState<CarouselImage[]>(
    project.carouselImages ?? []
  );

  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
  };

  const uploadImage = async (file: File, type: "thumbnail" | "carousel" ) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `/api/images/upload?projectId=${project._id}&type=${type}`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
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

    const res = await fetch(`/api/images/delete?projectId=${project._id}&type=thumbnail`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          originalPath: thumbnail.originalPath,
          responsive: thumbnail.responsive
            ?.map((img) => img.path)
            .filter(Boolean) ?? [],
        }),
      }
    );

    const result = await res.json();

    if (result.success) {
      setThumbnail(null);
      onUpdated(result.project);
    }
  };

  const deleteCarouselImage = async (image: CarouselImage) => {
    const token = getToken();

    const res = await fetch(`/api/images/delete?projectId=${project._id}&type=carousel`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          originalPath: image.originalPath,
          responsive: image.responsive
            ?.map((img) => img.path)
            .filter(Boolean) ?? [],
        }),
      }
    );

    const result = await res.json();

    if (result.success) {
      setCarousel((prev) =>
        prev.filter((img) => img.originalPath !== image.originalPath)
      );

      onUpdated(result.project);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button data-testid="close-button" className={styles.closeButton} onClick={onClose} disabled={loading}>
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
          <input data-testid="thumbnail-input" type="file" accept="image/*" disabled={!!thumbnail} className={thumbnail ? styles.disabledInput : ""} onChange={handleThumbnailUpload} />
        </div>

        <h3>Images du carousel</h3>

        <div className={styles.carouselGrid}>
          {carousel.map((img, i) => (
            <div key={i} className={styles.carouselItem}>
              <div className={styles.imageWrapper}>
                <Image src={img.original} alt={`carousel-${i}`} width={200} height={200} className={styles.carouselImage} />

                <button className={styles.deleteIcon} onClick={() => deleteCarouselImage(img)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleCarouselUpload} />
        </div>
      </div>
    </div>
  );
};

export default AdminProjectImagesModal;
