import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Sidebar2.module.css"; // Ensure CSS Module is correctly imported
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Sidebar2 = () => {
  // Accept isOpen as prop

  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(true);

  if (!user.email) {
    return <Navigate to="/login" />;
  }

  const content =
    user.role === "ADMIN"
      ? ["Home", "Pending Requests", "Contact"]
      : ["Home", "Book Dining", "Services", "Contact"];

  return (
    <div className="flex flex-col">
      <div
        className={
          "absolute top-3 text-white cursor-pointer left-4 z-20 text-xl flex gap-2 items-baseline" +
          styles.menuIcon
        }
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>☰</div>
        <div className='text-xl relative font-["Single Day"] font-["Dosis"]'>
          GUEST HOUSE
        </div>
        <div className="bottom-[2px] relative ">
          <HomeOutlinedIcon className="h-20 w-20" fontSize="medium" />
        </div>
      </div>
      <hr></hr>
      <div
        className={
          "text-white " + `${styles.sidebar} ${!isOpen ? styles.closed : ""}`
        }
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "all 0.2s",
        }}
      >
        <ul
          className={
            styles["sidebar-menu"] +
            `${isOpen ? "" : styles["sidebar-menu-closed"]}`
          }
        >
          {content.map((item, index) => (
            <Link
              className=""
              to={item==='Home' ? '/dining' :`/dining/${item.toLowerCase().replace(" ", "-")}`}
            >
              <li className={" " + styles["menu-item"]} key={index}>
                {item}
              </li>
              <hr></hr>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar2;
