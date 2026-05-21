import styles from './style.module.scss'

import Logo from '../Logo/Logo'


const NamePlate = () => {
  return (
    <span data-testid="nameplate" className={styles.namePlate}>
        <Logo />
        <h1 className={styles.name}>Valker, développeur web</h1>
    </span>
  )
};

export default NamePlate