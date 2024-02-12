import React from 'react';
import "./Contact.css";
// import logo from "../images/IIT_Ropar_logo.png";

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
          <FooterComponent />
        </main>
      </div>
      
    </>
  );
};

const FooterComponent = () => (
  <section className = "footerComponent">
    <div className="dark-background"> {/* Added dark background */}
      <section className="footer-links-section"> {/* Separate section for links */}
        <div className="footer-links">
          <LinkBox href="https://www.iitrpr.ac.in/">IIT ROPAR OFFICIAL WEBSITE</LinkBox>
          <LinkBox href="https://en.wikipedia.org/wiki/IIT_Ropar  ">IIT ROPAR WIKIPEDIA</LinkBox>
          <LinkBox href="#">Link 3</LinkBox>
        </div>
      </section>
    </div>
  </section>
);

const LinkBox = ({ children, href }) => (
  <div className="link-box">
    <a href={href}>{children}</a>
  </div>
);

const ContactForm = () => (
  <section className="contact" id="contact" style={{ marginBottom: '20px' }}>
    <h2 className="contact-us">Contact Us</h2>
    <form className="contact-form">
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
