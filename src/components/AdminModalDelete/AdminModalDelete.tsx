"use client";

import styles from "./style.module.scss";

type ModalConfirmProps = {
  open: boolean;
  projectId: string | null;
  title?: string;
  message?: string;
  onSuccess: (deletedId: string) => void;
  onCancel: () => void;
};

const AdminModalDelete = ({ open, projectId, onSuccess, onCancel }: ModalConfirmProps) => {

  if (!open || !projectId) return null;

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("JWT manquant");

      await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess(projectId);
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Supprimer ce projet ?</h3>
        <p className={styles.message}>Voulez-vous vraiment effectuer cette action ?</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Annuler
          </button>
          <button className={styles.confirm} onClick={handleConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModalDelete;
