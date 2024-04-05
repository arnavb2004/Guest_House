import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "./Menu";
import Logo from "../images/IIT-logo.png";
import UserProfileDialog from "./UserProfileDialog";
import NotificationMenu from "./NotificationMenu";
import Badge from "@mui/material/Badge";
import Text from "./Text";

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  

  const handleLogout = () => {
    dispatch(logout());
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleNotificationClick = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
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
          <Text/>
        </div>
        <div className='font-["Dosis"] col-span-5 right-1 top-16 text-md gap-4 absolute uppercase flex p-3 pr-12 w-full justify-end mb-4 text-right font-medium items-center'>
          {user.email && (
            <>
              <div className="cursor-default">
                <IconButton onClick={handleOpenDialog} size="large">
                  <AccountCircleIcon />
                </IconButton>
              </div>
              <div className="relative">
                <IconButton onClick={handleNotificationClick}>
                  <Badge badgeContent={4} color="warning">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                {notificationMenuOpen && (
                  <div className="absolute top-full right-0 mt-2">
                    <NotificationMenu />
                  </div>
                )}
              </div>
            </>
          )}
          {user.email ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={goToLoginPage}
            >
              LOGIN
            </button>
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
