import React from "react";
import Menu from "../components/Menu";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import ReservationForm from "./Reservation_Form";
import RecordList from "../components/RecordList";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function AdminPage() {
  const ifsubmit = false;
  return (
    <>
      <div className="w-full flex flex-col h-screen">
        <Menu />
        <div className="w-full flex h-screen overflow-hidden">
          <Sidebar />
          <div className="w-full px-9 overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
