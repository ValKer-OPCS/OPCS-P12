import styles from './style.module.scss'
import Link from 'next/link'


import NamePlate from '../../components/NamePlate/NamePlate';



const Header = () => {

  return (

    <header data-testid="header" className={styles.headerContainer}>
      <Link href={"/"}> <NamePlate /> </Link>
      <nav>
        <ul className={styles.navBar}>
          <li><a href="#about">A propos</a></li>
          <li><a href="#projects">Projets</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
};

export default Header


