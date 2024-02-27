import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from './Sidebar.module.css'; // Ensure CSS Module is correctly imported

const Sidebar = ({ isOpen }) => { // Accept isOpen as prop

  const user = useSelector((state) => state.user);

  if (!user.email) {
    return <Navigate to="/login" />;
  }

  const content = user.role === 'ADMIN' ? 
  ["Home", "Pending Requests", "Contact"] : 
  ["Home", "Register Form", "Services", "Contact"];

  return (
    <div className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`} style={{transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'}}>
      <ul className={styles["sidebar-menu"]}>
        {content.map((item, index) => (
          <li className={styles["menu-item"]} key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
