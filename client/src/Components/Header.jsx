import React, { useEffect, useState } from "react";
import Logo from "../images/IIT-logo.png";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserSlice } from "../redux/formSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";


const Header = () => {

  const user = useSelector((state) => state.user).user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLoginLogout, setShowLoginLogout] = useState(0) // 0 for user greetings, 1 for login, and 2 for logout
  useEffect(() => {
    if(user.email) {
      setShowLoginLogout(0)
    } else {
      setShowLoginLogout(1)
    }
  }, [])

  const handleLogout = async (e) => {
    dispatch(logout());
    // await axios.get(BASE_URL + "/logout", { withCredentials: true });
    localStorage.clear();
    navigate("/", { replace: true });
  };
  const goToLoginPage = () => {
    navigate("/login");
  }

  const handleMouseOver = () => {
    if(user.name) {
      setShowLoginLogout(2)
    } else {
      setShowLoginLogout(1)
    }
  }

  const handleMouseOut = () => {
    if(user.name) {
      setShowLoginLogout(0)
    } else {
      setShowLoginLogout(1)
    }
  }

  return (
    <div className="header flex flex-col items-center ">
      <div className="header-container w-full px-10 h-40 grid grid-cols-12 py-2 pb-5">
        <div className="col-span-6 flex flex-col justify-end pb-2">
          <a className='font-["Single Day"] font-["Dosis"] text-5xl text-justify pl-56 font-bold' href="/">
            GUEST HOUSE
          </a>
          <a className='text-3xl text-justify pl-56 font-medium font-["Dosis"]' href="/">
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </a>
        </div>
        <div
          className="col-span-4 flex p-3 pr-12 flex-col w-full justify-end mb-4 font-serif text-2xl text-right font-medium"
          onMouseOver={() => handleMouseOver()}
          onMouseOut={() => handleMouseOut()}
        >
          {showLoginLogout == 0 && <div className="transition-transform transform transition-delay-300 group-hover:hidden">Hello {user.name} </div>}
          {showLoginLogout == 1 && <div
              onClick={goToLoginPage}
              className="hover:cursor-pointer top-10  transition-transform transform transition-delay-300 group-hover:block"
            >
              Login
          </div>}
          {showLoginLogout == 2 && <div
              onClick={handleLogout}
              className="hover:cursor-pointer top-10  transition-transform transform transition-delay-300 group-hover:block"
            >
              Logout
          </div>}
          
        </div>
        <div className=" flex gap-4 w-28 h-32 pt-4">
          <img className="" src={Logo} alt="IIT Ropar logo" />
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
