import React from "react";
import Logo from "../images/IIT-logo.png";
import Menu from "./Menu";

const Header = () => {
  return (
    <div className="header flex flex-col items-center py-4 gap-3">
      <div className="header-container w-2/3 h-32 flex justify-between py-2">
        <div className="w-56 flex flex-col justify-end">
          <a className='font-["Single Day"] text-4xl font-bold' href="/">
            Guest House
          </a>
          <a className="text-3xl" href="/">
            IIT Ropar
          </a>
        </div>
        <div className="py-2"></div>
        <div className="w-28 h-32 py-2">
          <img className="" src={Logo} alt="IIT Ropar logo" />
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
