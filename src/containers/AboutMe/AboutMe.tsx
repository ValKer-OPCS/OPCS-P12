import Image from 'next/image';
import styles from './style.module.scss'
import ogImage from '../../app/og-image.png'
import aboutMe from '@/data/aboutMe.json'


const AboutMe = () => {
  return (
    <section data-testid="about-section" id='about' className={styles.aboutContainer}>
      <Image className={styles.aboutPic} src={ogImage} width={300} height={300} alt='Picture of ValKer' />

      <div className={styles.aboutText}>
        {aboutMe.text.map((line, index) => (
          <p key={index}>
            {line}
          </p>
        ))}
      </div>
    </section>
  )
};

export default AboutMe
