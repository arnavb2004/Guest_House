import React from 'react'
import "./Footer.css";
import logo from '../images/IIT_Ropar_logo.png'

const Footer = () => {
  return (
      <footer className="footer">
      <div className="footer-section about-us flex flex-col gap-1">
        <h4>About Us</h4>
        <img src = {logo} className = "h-20 flex w-20 m-auto h-screen"></img>
        <p>Indian Institute of Technology Ropar  
          (IIT Ropar) is a public technical university located in Rupnagar, Punjab, India. (IITs).</p>
      </div>
      <div className="footer-section quick-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </div>
      <div className="footer-section contact-info">
        <h4>Contact Info</h4>
        <p><strong>Email:</strong> contact@yourguesthouse.com</p>
        <p><strong>Phone:</strong> +1 234 567 890</p>
        <p><strong>Address:</strong> 123 Street, City, Country</p>
      </div>
      <div className='footer flex justify-center '>
        <p className='px-2 text-sm'>Copyright @2024 IIT Ropar</p>
      </div>
    </footer>
  )
}

export default Footer