import styles from './style.module.scss';
import Link from 'next/link';

import NamePlate from '../../components/NamePlate/NamePlate';
import NavBar from '@/components/NavBar/NavBar';

const Header = () => {

  return (
    <header data-testid="header" className={styles.headerContainer}>
      <Link href={"/"}><NamePlate /></Link>

      <NavBar />

    </header>
  );
};

export default Header;
