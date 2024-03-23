import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice"; // Ensure this action is correctly implemented in your slice

import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "./Menu"; // Assuming Menu is a correctly implemented component
import Logo from "../images/IIT-logo.png"; // Ensure the path is correct

import UserProfileDialog from "./UserProfileDialog";

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showHindi, setShowHindi] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHindi((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <div className="header flex flex-col items-center bg-gray-50">
      <div className="header-container w-5/6 px-10 h-40 grid grid-cols-12 py-2 pb-5">
        <div className="flex gap-4 w-28 h-32 pt-4">
          <img src={Logo} alt="IIT Ropar logo" />
        </div>
        <div className="col-span-6 flex flex-col pl-5 justify-end pb-2">
          <a
            className='font-["Dosis"] text-5xl text-justify  font-bold'
            href="/"
          >
            GUEST HOUSE
          </a>
          <a
            className='text-3xl text-justify min-w-max font-medium font-["Dosis"]'
            href="/"
          >
            <div className="flex flex-col h-9 py-1 ">
              <div className={!showHindi && "h-0 overflow-hidden"}>
                भारतीय प्रौद्योगिकी संस्थान रोपड़
              </div>
              <div className={showHindi && "h-0 overflow-hidden"}>
                INDIAN INSTITUTE OF TECHNOLOGY ROPAR
              </div>
            </div>
          </a>
        </div>
        <div className='font-["Dosis"] col-span-5 right-1 top-16 gap-4 absolute uppercase flex p-3 pr-12 w-full justify-end mb-4 text-2xl text-right font-medium items-center'>
          {user.email && (
            <div className="cursor-default">
              <IconButton onClick={handleOpenDialog} size="large">
                <AccountCircleIcon />
              </IconButton>
            </div>
          )}
          <div className="cursor-pointer">
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </div>
          {user.email ? (
            <div className="cursor-pointer" onClick={handleLogout}>
              LOGOUT
            </div>
          ) : (
            <div className="cursor-pointer" onClick={goToLoginPage}>
              LOGIN
            </div>
          )}
          <UserProfileDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
          />
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
