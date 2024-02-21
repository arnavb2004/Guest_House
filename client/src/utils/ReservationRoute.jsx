import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Reservation from "../pages/Reservation";
import Admin_Reservation from "../pages/Admin_Reservation";

const ReservationRoute = () => {

    const user = useSelector((state) => state.user)

    const dispatch = useDispatch()

    if(user.email){

        if(user.role==='ADMIN'){
            return <Admin_Reservation/>
        }
        else{
            return <Reservation/>
        }

    }
    else{
        return <Navigate to="/login" />;
    }

};

export default ReservationRoute;
