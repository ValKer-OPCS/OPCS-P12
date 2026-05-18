"use client";

import { usePathname, useRouter } from 'next/navigation';
import styles from "./style.module.scss";


const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname.startsWith("/dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <nav>
        <ul className={styles.navBar}>
          {isDashboard ? (
            <>
              <li><button onClick={handleLogout}>Déconnexion</button></li>
            </>
          ) : (
            <>
              <li><a href="#about">A propos</a></li>
              <li><a href="#projects">Projets</a></li>
              <li><a href="#contact">Contact</a></li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
