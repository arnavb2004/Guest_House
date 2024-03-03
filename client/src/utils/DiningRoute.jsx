import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Dining from "../pages/Dining";
import Admin_Dining from "../pages/Admin_Dining";
import { useSelector , useDispatch} from "react-redux"; 

const DiningRoute = () => {

  const user = useSelector((state) => state.user);
  
  if(user.email){
    return <Dining />
  }
  else{
    return <Navigate to="/login" />;
  }

};

export default DiningRoute;
