import { Navigate, Outlet } from "react-router-dom";


import React from "react";
import { useSelector } from "react-redux";

const Auth = ({ allowedRoles }) => {

    const user = useSelector((state)=>state.user);

  return allowedRoles.find((role) => user.role.includes(role)) ? (
    <Outlet />
  ) : user?.email ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login"/>
  );
};

export default Auth;