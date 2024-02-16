import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
  }, [selectedItem]);

  const menuItems = [
    { id: 1, name: "home", label: "HOME", link: "/" },
    { id: 2, name: "dining", label: "DINING", link: "/dining" },
    { id: 3, name: "people", label: "PEOPLE", link: "/people" },
    { id: 4, name: "location", label: "LOCATION", link: "/location" },
    { id: 5, name: "reservation", label: "RESERVATION", link: "/reservation" },
    { id: 6, name: "contact", label: "CONTACT", link: "/contact" },
  ];

  return (
    <div className="menu w-full h-full flex justify-center  ">
      <div className="menu-container w-full h-12 pr-3  text-white bg-[#365899]">
        <ul className="tabs h-full flex justify-center items-center">
          {menuItems.map((item) => (
            <Link
              exact
              to={item.link}
              onClick={() => setSelectedItem(`${item.name}`)}
              className={`flex justify-center items-center px-8 h-full ${
                (selectedItem === item.name || hovered === item.name) &&
                " bg-[#284272d7]"
              } `}
              onMouseOver={() => setHovered(`${item.name}`)}
              onMouseOut={() => setHovered(null)}
            >
              {/* 284272d7 */}

              <li key={item.id}>
                <div className="text-center" activeClassName="text-black">
                  {item.label}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
