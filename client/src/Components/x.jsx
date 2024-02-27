import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';
import styles from "./Header2.module.css"; // Assuming this is the correct path

const Header2 = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (selectedItem) {
      localStorage.setItem("selectedItem", selectedItem);
    }
  }, [selectedItem]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { id: 1, name: "home", label: "HOME", link: "/" },
    { id: 2, name: "dining", label: "DINING", link: "/dining" },
    { id: 3, name: "people", label: "PEOPLE", link: "/people" },
    { id: 4, name: "location", label: "LOCATION", link: "/location" },
    { id: 5, name: "reservation", label: "RESERVATION", link: "/reservation" },
    { id: 6, name: "contact", label: "CONTACT", link: "/contact" },
  ];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerIcon} onClick={toggleSidebar}>☰</div>
          <nav className={styles.menuContainer}>
            <ul className={styles.tabs}>
              {menuItems.map((item) => (
                <li key={item.id} className={styles.tabItem}>
                  <Link
                    to={item.link}
                    onClick={() => setSelectedItem(item.name)}
                    className={`${styles.tabLink} ${selectedItem === item.name ? styles.active : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} />
    </div>
  );
};

export default Header2;
