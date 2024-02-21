import React, { useEffect, useState } from "react";
import Logo from "../images/IIT-logo.png";
import Menu from "./Menu";
import { useSelector } from "react-redux";


const Header = () => {

  const user = useSelector((state) => state.user).user


  return (
    <div className="header flex flex-col items-center ">
      <div className="header-container w-full px-10 h-40 grid grid-cols-12 py-2 pb-5">
        <div className="col-span-6 flex flex-col justify-end pb-2">
          <a className='font-["Single Day"] font-["Dosis"] uppercase text-5xl text-justify pl-56 font-bold' href="/">
            Guest House
          </a>
          <a className='text-3xl text-justify pl-56 font-medium font-["Dosis"]' href="/">
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </a>
        </div>
        {user.name && <div className="col-span-4 flex p-3 pr-12 flex-col w-full justify-end mb-4 font-serif text-2xl text-right font-medium">Hello {user.name}</div>}
        <div className=" flex gap-4 w-28 h-32 pt-4">
          <img className="" src={Logo} alt="IIT Ropar logo" />
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
