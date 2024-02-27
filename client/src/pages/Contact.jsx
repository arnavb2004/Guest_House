import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import styles from "./Contact.module.css";

const center = [31.1048, 76.5259]; // Latitude and Longitude of IIT Ropar

const Contact = () => {

  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <>
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.welcomeSection}>
            <h1>Welcome to Our Guest House</h1>
            <p>Your comfort is our priority.</p>
          </div>
          <div className={styles.contentLayout}>
            <ContactForm />
            <div className={styles.mapIframeContainer} style={{ width: "50%" }}>
              <iframe
                width="100%"
                height="600"
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=IIT%20Ropar,%20Main%20Campus+(IIT%20Ropar%20Guest%20House)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                title="IIT Ropar Location">
              </iframe>
            </div>
          </div>
          <div className={styles.captchaContainer}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY}
              onChange={onCaptchaChange}
              className={styles.recaptcha}
            />
          </div>
        </main>
      </div>
    </>
  );
};

const ContactForm = () => (
  <section className={styles.contact}>
    <form className={styles.contactForm}>
      <h2 className={styles.contactUs}>CONTACT US</h2>
      <div className={styles.formGroup}>
        <FontAwesomeIcon icon={faUser} />
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <FontAwesomeIcon icon={faEnvelope} />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <FontAwesomeIcon icon={faPen} />
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Your Message"
          required
        ></textarea>
      </div>
      <button type="submit" className={styles.submitButton}>
        Send Message
      </button>
    </form>
  </section>
);

export default Contact;
