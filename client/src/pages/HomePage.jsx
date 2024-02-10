import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from '../components/Menu'
import { Outlet } from "react-router-dom";
import backgroundImage from '../images/backgroundImage.jpeg';

const HomePage = () => {
  return (
    <div className="home-page border h-screen flex border-red-500 flex-col justify-between">
      <div>
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>

      {/* Slideshow starts */}

      {/* Slideshow ends */}

      {/* Content starts */}
      <div className="content"></div>
      {/* Content ends */}

    </div>
  );
};

export default HomePage;
