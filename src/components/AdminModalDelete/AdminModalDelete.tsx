"use client";

import styles from "./style.module.scss";

type ModalConfirmProps = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const AdminModalDelete = ({  open, title = "Confirmation", message = "Voulez-vous vraiment effectuer cette action ?",
                              onConfirm, onCancel }: ModalConfirmProps) => {

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Annuler
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModalDelete;
