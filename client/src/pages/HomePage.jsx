import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import backgroundImage from "../images/backgroundImage.jpeg";

const HomePage = () => {
  return (
    <div
      className="homePage min-h-screen gap-4 flex flex-col justify-between bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="">
        <Header />
      </div>
      <div className="w-full flex justify-center min-h-screen">
        <Outlet />
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
