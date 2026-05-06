import ContactForm from "@/components/ContactForm/ContactForm";
import style from './style.module.scss'


const Contact = () => {
  return (
    <section data-testid="contact-section" id="contact" className={style.contactContainer}>
      <h2 className={style.contactContainerTitle} >Contact</h2>

      <ContactForm />

    </section>
  )
};

export default Contact
