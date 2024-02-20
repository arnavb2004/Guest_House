import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dining from "../pages/Dining";
import Admin_Dining from "../pages/Admin_Dining";

const DiningRoute = () => {

  // const [user, setUser] = useState("");
  // console.log(user)

  // useEffect(() => {
  //   console.log(JSON.parse(localStorage.getItem("user")))
  //   setUser(JSON.parse(localStorage.getItem("user")))
  // },[]);

  // console.log(user.email)

  const user = useSelector((state) => state.user);

  // console.log(user)

  // console.log(user.user)

  if(user.user.email){
    console.log("in email")
    if(user.user.role==='ADMIN'){
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
