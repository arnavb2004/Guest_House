import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { fetchNotifications } from "../redux/notificationSlice";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from "../images/IIT-logo.png";
import UserProfileDialog from "./UserProfileDialog";
import NotificationMenu from "./NotificationMenu";

const NewHeader = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showHindi, setShowHindi] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setShowHindi((prev) => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      dispatch(fetchNotifications());
    }, [dispatch]);

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
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 shadow-lg">
            <div className="flex items-center">
                <img src={Logo} alt="IIT Ropar Logo" className="mr-4 h-16" />
                <div>
                    <a href="/" className="block text-xl font-bold font-['Dosis'] text-gray-800">
                        GUEST HOUSE
                    </a>
                    <a className="text-3xl font-semibold font-['Dosis'] text-gray-700 hover:text-gray-900" href="/">
                        <div className="flex flex-col">
                            <div className={!showHindi ? "" : "hidden"}>
                                भारतीय प्रौद्योगिकी संस्थान रोपड़
                            </div>
                            <div className={showHindi ? "" : "hidden"}>
                                INDIAN INSTITUTE OF TECHNOLOGY ROPAR
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {user.email && (
                    <>
                        <IconButton onClick={handleOpenDialog} size="large">
                            <AccountCircleIcon />
                        </IconButton>
                        <span>{user.name || user.email}</span> {/* Display the user's name or email */}
                    </>
                )}
                <div className="relative">
                    <IconButton onClick={handleNotificationClick}>
                        <NotificationsIcon />
                    </IconButton>
                    {notificationMenuOpen && (
                        <NotificationMenu/>
                    )}
                </div>
                {user.email ? (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
                        LOGOUT
                    </button>
                ) : (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={goToLoginPage}>
                        LOGIN
                    </button>
                )}
                <UserProfileDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                />
            </div>
        </div>
    );
};

export default NewHeader;
