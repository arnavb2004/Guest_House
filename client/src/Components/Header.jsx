import React, { useEffect, useState } from "react";
import Logo from "../images/IIT-logo.png";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import { logout } from "../redux/userSlice";
// import PersonIcon from "@mui/icons-material/Person";
// import Roll from "react-reveal/Roll";
import Fade from "react-reveal/Fade";

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  const [showHindi, setShowHindi] = useState(false);
  console.log(showHindi);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHindi((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async (e) => {
    dispatch(logout());
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div className="header flex flex-col items-center  bg-gray-50">
      <div className="header-container w-5/6 px-10 h-40 grid grid-cols-12 py-2 pb-5">
        <div className=" flex gap-4 w-28 h-32 pt-4">
          <img className="" src={Logo} alt="IIT Ropar logo" />
        </div>
        <div className="col-span-6 flex flex-col pl-5 justify-end pb-2">
          <a
            className='font-["Single Day"] font-["Dosis"] text-5xl text-justify  font-bold'
            href="/"
          >
            GUEST HOUSE
          </a>
          <a
            className='text-3xl text-justify min-w-max font-medium font-["Dosis"]'
            href="/"
          >
            <Fade>
              <div className="flex flex-col h-9 py-1 ">
                <div className={!showHindi && "h-0 overflow-hidden"}>
                  भारतीय प्रौद्योगिकी संस्थान रोपड़
                </div>
                <div className={showHindi && "h-0 overflow-hidden"}>
                  INDIAN INSTITUTE OF TECHNOLOGY ROPAR
                </div>
              </div>
            </Fade>
          </a>
        </div>
        <div
          className="col-span-4 flex p-3 pr-12 flex-col w-full justify-end mb-4 font-serif text-2xl text-right font-medium cursor-pointer"
          onMouseOver={() => setShowLogout(true)}
          onMouseOut={() => setShowLogout(false)}
          onClick={user.email ? handleLogout : goToLoginPage}
        >
          {user.email ? (
            showLogout ? (
              "Logout"
            ) : (
              <div className="">Hello {user.name}</div>
            )
          ) : (
            <>
              <div>Login</div>
            </>
          )}
        </div>
        {/* <div className=" flex gap-4 w-28 h-32 pt-4">
          <img className="" src={Logo} alt="IIT Ropar logo" />
        </div> */}
      </div>
      <Menu />
    </div>
  );
};

export default Header;
