"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser, faFolder, faEnvelope, faArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";
import styles from "./style.module.scss";

type NavItem = {
  label: string;
  href: string;
  icon: IconProp;
  onClick?: () => void;
};

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getNavItems = (): NavItem[] => {
    switch (true) {
      case pathname === "/":
        return [
          { label: "A propos", href: "#about", icon: faUser },
          { label: "Projets", href: "#projects", icon: faFolder },
          { label: "Contact", href: "#contact", icon: faEnvelope }
        ];

      case pathname.startsWith("/dashboard"):
        return [
          { label: "Déconnexion", href: "/", icon: faRightFromBracket, onClick: handleLogout }
        ];

      case pathname.startsWith("/login"):
        return [
          { label: "Retour à l'accueil", href: "/", icon: faArrowLeft }
        ];

      default:
        return [
          { label: "Retour à l'accueil", href: "/", icon: faArrowLeft }
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav>
      <ul className={styles.navBar}>
        {items.map((item, i) => (
          <li key={i}>
            <Link href={item.href} onClick={(e) => { if (item.onClick) { e.preventDefault(); item.onClick(); } }} >
              <span className={styles.icon}>
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className={styles.text}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
