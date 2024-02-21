import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dining from "../pages/Dining";
import Admin_Dining from "../pages/Admin_Dining";

const DiningRoute = () => {

  const user = useSelector((state) => state.user);


  if(user.email){
    console.log("in email")
    if(user.role==='ADMIN'){
      console.log("in ADMIN")
        return <Admin_Dining />
    }
    else{
        return <Dining />
    }

  }
  else{
        return <Navigate to="/login" />;
  }

};

export default DiningRoute;
