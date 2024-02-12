import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import backgroundImage from "../images/backgroundImage.jpeg";

const HomePage = () => {
  return (
    <div className="homePage h-screen flex flex-col justify-between bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header />
      <div className="w-full flex justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
