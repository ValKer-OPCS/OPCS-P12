"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./style.module.scss";

type NavItem = {
  label: string;
  href: string;
  onClick?: () => void;
};

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const getNavItems = (): NavItem[] => {
    switch (true) {

      case pathname === "/":
        return [
          { label: "A propos", href: "#about" },
          { label: "Projets", href: "#projects" },
          { label: "Contact", href: "#contact" }
        ];

      case pathname.startsWith("/dashboard"):
        return [
          { label: "Déconnexion", href: "/", onClick: handleLogout }
        ];

      case pathname.startsWith("/login"):
        return [
          { label: "Retour à l'accueil", href: "/" }
        ];

      default:
        return [
          { label: "Retour à l'accueil", href: "/" }
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
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
