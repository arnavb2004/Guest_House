import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faPen } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <>
        <div className="container flex flex-col font-['Dosis']">
            <div className="mainContent">
                <div className="flex">
                    <div className="contactForm flex flex-col">
                        <div className="text-2xl font-semibold">Contact Us!</div>
                        <div>
                            <textarea 
                                name="name"
                                id="name" 
                                cols="30" 
                                rows="" 
                                placeholder="Your Name" 
                                required/>
                        </div>
                    </div>
                    <div className="mapContainer"></div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Contact;
