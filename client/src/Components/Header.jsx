import React from "react";
import Logo from "../images/IIT-logo.png";
import Menu from "./Menu";


const Header = () => {
  return (
    <div className="header flex flex-col items-center ">
      <div className="header-container w-full px-10 h-40 flex justify-around py-2 pb-5">
        <div className=" flex flex-col justify-end pb-2">
          <a className='font-["Single Day"] font-["Dosis"] uppercase text-5xl font-bold' href="/">
            Guest House
          </a>
          <a className='text-3xl font-medium font-["Dosis"]' href="/">
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </a>
        </div>
        <div className="w-28 h-32 pt-4">
          <img className="" src={Logo} alt="IIT Ropar logo" />
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
