import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { Outlet } from "react-router-dom";
import DiningSidebar from "../components/DiningSidebar";
import Header from "../components/Header";

function Dining() {
  return (
    <>
      <div className="w-full flex flex-col h-screen">
        <Header />
        <Menu />
        <div className="w-full flex h-screen overflow-hidden ">
          <DiningSidebar />
          <div className="w-full px-9 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dining;
