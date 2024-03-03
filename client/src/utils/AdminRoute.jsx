import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Reservation from "../pages/Reservation";
import Admin_Reservation from "../pages/Admin_Reservation";
import { useSelector , useDispatch} from "react-redux";
import AdminPage from "../pages/AdminPage";
import AdminHomePage from "../pages/AdminHomePage";
const AdminRoute = () => {

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    
    if(user.email){
        if(user.role==='ADMIN')
            return <AdminPage/>
        else
            return <Navigate to="/login" />;
    }
    else{
        return <Navigate to="/login" />;
    }

};

export default AdminRoute;
