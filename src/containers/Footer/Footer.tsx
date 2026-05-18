"use client"

import { useState } from "react"
import Link from 'next/link'
import styles from './style.module.scss'

import footerPrivacy from "@/data/footerPrivacy.json"
import footerTerms from "@/data/footerTerms.json"

const Footer = () => {

  const year = new Date().getFullYear();

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);


  const getModalText = () => {
    switch (activeModal) {
      case "privacy":
        return footerPrivacy.text;

      case "terms":

        return footerTerms.text;

      default:
        return [];
    }
  };


  return (
    <>
      <footer data-testid="footer" className={styles.footerContainer}>
        <p>© {year} ValKer. All rights reserved</p>

        <ul>
          <li onClick={() => openModal("privacy")}>Privacy</li>
          <li onClick={() => openModal("terms")}>Terms</li>
          <li><Link href="/login">Login</Link></li>
        </ul>
      </footer>

      {activeModal && (
        <div data-testid="modal-overlay" className={styles.overlay} onClick={closeModal}>
          <div data-testid="modal-content" className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={closeModal}>X</button>

            {getModalText().map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;