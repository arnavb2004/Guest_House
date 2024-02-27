import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector , useDispatch} from "react-redux"; 

const PrivateRoute = () => {

  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
