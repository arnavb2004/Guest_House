import React from 'react';
import "./Contact.css";

const Contact = () => {
  return (
    <>
      <div className="container">
        <main className="main-content">
          <div className="welcome-section">
            <h1>Welcome to Our Guest House</h1>
            <p>Your comfort is our priority.</p>
          </div>
          <ContactForm />
        </main>
      </div>
    </>
  );
};

const ContactForm = () => (
  <section className="contact" id="contact">
    <form className="contact-form">
    <h2 className="contact-us text-xl pb-4">CONTACT US</h2>
      <div className="form-group">
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          required
        />
      </div>
      <div className="form-group">
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Your Message"
          required
        ></textarea>
      </div>
      <button type="submit" className="submit-button">
        Send Message
      </button>
    </form>
  </section>
);

export default Contact;
