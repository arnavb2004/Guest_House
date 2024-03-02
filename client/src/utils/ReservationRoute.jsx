import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Reservation from "../pages/Reservation";
import Admin_Reservation from "../pages/Admin_Reservation";
import { useSelector , useDispatch} from "react-redux"; 

const ReservationRoute = () => {

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    
    if(user.email){
        return <Reservation/>
    }
    else{
        return <Navigate to="/login" />;
    }

};

export default ReservationRoute;
