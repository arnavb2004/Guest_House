import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faPen } from "@fortawesome/free-solid-svg-icons";
import styles from "./Contact.module.css";

const Icons = () => {
  return (
    <div className="flex justify-center mt-8 space-x-4">
      <a href="#" className="text-gray-600 hover:text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Social media icon (e.g., Facebook, Twitter, etc.) */}
        </svg>
      </a>
      {/* Add more social media icons here */}
    </div>
  );
};

const Contact = () => {
  
  return (
    <>
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.welcomeSection}></div>
          <div className={styles.contentLayout}>
            <ContactForm />
            <Map />
          </div>
        </main>
      </div>
    </>
  );
};

const Map = () => (
  <div className={styles.mapIframeContainer} style={{ width: "50%" }}>
    <iframe
      width="100%"
      height="600"
      src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=IIT%20Ropar,%20Main%20Campus+(IIT%20Ropar%20Guest%20House)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      title="IIT Ropar Location"
    ></iframe>
  </div>
);

const ContactForm = () => {
  const handleSubmit = (e) => {};
  return (
    <section className={styles.contact}>
      <form className={styles.contactForm}>
        <h2
          className={
            styles.contactUs +
            ' text-center font-semibold font-["Dosis"] text-2xl pb-5'
          }
        >
          CONTACT US
        </h2>
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
        <button
          onClick={handleSubmit}
          className={styles.submitButton + " ml-7 mt-2"}
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact;
