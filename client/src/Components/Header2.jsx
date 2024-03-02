import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';
import styles from './Header2.module.css';

const Header2 = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
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
    <div className="col-span-2 menu w-full h-full flex justify-center">
      <div className="menu-container w-full h-12 pr-5 text-white bg-[#365899] flex items-center">
        <div className={styles.menuIcon} onClick={toggleSidebar}>☰</div>
        <ul className="tabs flex justify-center items-center w-full h-full">
          {menuItems.map((item) => (
            <li key={item.id} className="flex h-full">
              <Link
                exact
                to={item.link}
                onClick={() => setSelectedItem(item.name)}
                className={`flex justify-center items-center h-full px-8 ${
                  (selectedItem === item.name || hovered === item.name) &&
                  " bg-[#284272d7]"
                } `}
                onMouseOver={() => setHovered(item.name)}
                onMouseOut={() => setHovered(null)}
              >
                <div className="text-center">{item.label}</div>
              </Link>
            </li>
          ))}
        </ul>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default Header2;
