import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hovered, setHovered] = useState(null);
  const user = useSelector((state) => state.user);


  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
  }, [selectedItem]);

  const menuItems = [
    { key: 1, name: "home", label: "HOME", link: "/" },
    {
      key: 2,
      name: "dining",
      label: "DINING",
      link: "/" + (user.role?.toLowerCase() || "unknown") + "/dining",
    },
    {
      key: 5,
      name: "reservation",
      label: "RESERVATION",
      link: "/" + (user.role?.toLowerCase() || "unknown") + "/reservation",
    },
    { key: 3, name: "people", label: "PEOPLE", link: "/people" },
    { key: 4, name: "location", label: "LOCATION", link: "/location" },
    { key: 6, name: "contact", label: "CONTACT", link: "/contact" },
  ];

  return (
    <div className="col-span-2 menu w-full h-15 flex justify-center ">
      <div className="menu-container w-full h-12 pr-3 flex justify-center align-center gap-44 text-white bg-[#365899]">
        <ul className="tabs h-full">
          <div className="flex justify-between h-full items-center">
            {menuItems.map((item) => (
              <Link
                exact="true"
                to={item.link}
                key={item.key}
                onClick={() => setSelectedItem(`${item.name}`)}
                className={`flex justify-center items-center px-8 h-full ${
                  (selectedItem === item.name || hovered === item.name) &&
                  " bg-[#284272d7]"
                } `}
                onMouseOver={() => setHovered(`${item.name}`)}
                onMouseOut={() => setHovered(null)}
              >
                <li>
                  <div className="text-center">{item.label}</div>
                </li>
              </Link>
            ))}
          </div>
        </ul>

        
      </div>
    </div>
  );
};

export default Menu;
