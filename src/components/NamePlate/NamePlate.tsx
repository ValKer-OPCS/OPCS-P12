import styles from './style.module.scss'

import Logo from '../Logo/Logo'


const NamePlate = () => {
  return (
    <span data-testid="nameplate" className={styles.namePlate}>
        <Logo />
        <p className={styles.name} >ValKer</p>
    </span>
  )
};

export default NamePlate