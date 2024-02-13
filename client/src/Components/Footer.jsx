import React from "react";
import "./Footer.css";
import logo from "../images/IIT_Ropar_logo.png";

const Footer = () => {
  return (
    <footer className="flex flex-col pt-[2rem] w-full  bg-[gray]  text-white bottom-0 ">
      <div className="flex justify-around">
        <div className=" flex flex-col gap-1 items-center">
          <h4>About Us</h4>
          <img src={logo} className="h-20 flex w-20 m-auto"></img>
          <p>
            Indian Institute of Technology Ropar (IIT Ropar) is a public
            technical university located in Rupnagar, Punjab, India. (IITs).
          </p>
        </div>
        <div className="footer-section quick-links">
          <h4 className="mb-2">Quick Links</h4>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-section contact-info">
          <h4 className="mb-2">Contact Info</h4>
          <p>
            <strong>Email:</strong> contact@yourguesthouse.com
          </p>
          <p>
            <strong>Phone:</strong> +1 234 567 890
          </p>
          <p>
            <strong>Address:</strong> 123 Street, City, Country
          </p>
        </div>
      </div>

      <div className=" flex justify-center ">
        <div className="px-2 pt-4 pb-2 text-sm ">Copyright @2024 IIT Ropar</div>
      </div>
    </footer>
  );
};

export default Footer;
