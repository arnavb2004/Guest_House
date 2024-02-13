import React from "react";
import { Outlet } from "react-router-dom";

const Reservation = () => {
  return (
    <div>
      <Outlet />
    </div>
    // <div className='reservation w-7/12 grid grid-cols-4'>
    //     <div className="content col-span-3 p-4">
    //         <p className='text-2xl'>Welcome to Reservation Page</p>
    //         <p className='font-serif'>Reservation Page content</p>
    //     </div>

    //     <div className="links col-span-1 p-4">
    //         <p className='text-2xl'>Other links</p>
    //         <p className='font-serif'>links</p>
    //     </div>
    // </div>
  );
};

export default Reservation;
