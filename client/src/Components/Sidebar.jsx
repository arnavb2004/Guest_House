import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Sidebar.module.css"; // Ensure CSS Module is correctly imported
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Sidebar = () => {
  // Accept isOpen as prop

  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(true);

  if (!user.email) {
    return <Navigate to="/login" />;
  }

  const content =
    user.role === "ADMIN"
      ? ["Pending Requests", "Rejected Requests", "Approved Requests", "Users"]
      : user.role === "USER"
      ? [
          "Pending Requests",
          "Rejected Requests",
          "Approved Requests",
          "Reservation Form",
        ]
      : user.role === "CASHIER"
      ? [
          "Current Requests",
          "Late Checkout",
          "Checked Out",
          "Checkout today",
          "Payment Pending",
        ] // other roles
      : ["Pending Requests", "Rejected Requests", "Approved Requests"];

  return (
    <div className="flex flex-col lg:absolute lg:z-100 h-full">
      <div
        className={
          "absolute top-28 lg:top-[-38px] text-white left-4 z-20 text-xl flex gap-2 items-baseline" +
          styles.menuIcon
        }
      >
        <div
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
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
              key={"sidebar-" + index}
              to={index === 0 ? "" : `${item.toLowerCase().replace(" ", "-")}`}
            >
              <li className={" " + styles["menu-item"]}>{item}</li>
              <hr></hr>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
