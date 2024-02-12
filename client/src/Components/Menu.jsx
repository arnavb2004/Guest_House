import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    localStorage.setItem('selectedItem', selectedItem);
  }, [selectedItem]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const menuItems = [
    { id: 1, name: 'home', label: 'HOME', link: '/' },
    { id: 2, name: 'dining', label: 'DINING', link: '/dining' },
    { id: 3, name: 'people', label: 'PEOPLE', link: '/people' },
    { id: 4, name: 'location', label: 'LOCATION', link: '/location' },
    { id: 5, name: 'reservation', label: 'RESERVATION', link: '/reservation' },
    { id: 6, name: 'contact', label: 'CONTACT', link: '/contact' },
  ];


  return (
    <div className="menu w-full h-full flex justify-center pt-2">
      <div className="menu-container w-2/3 h-10 pr-3" style={{ background: 'linear-gradient(to bottom, #E8F4FF, #B4E6FF)' }}>
        <ul className="tabs h-full flex justify-end">
          {menuItems.map((item) => (
              <li
                key={item.id}
                className={`flex justify-center items-center px-2 text-l ${
                  selectedItem === `${item.name}` ? 'customized-menu-item' : hovered === `${item.name}` ? 'customized-menu-item' : ''
                }`}
                onMouseOver={() => setHovered(`${item.name}`)}
                onMouseOut={() => setHovered(null)}
              >
                <Link
                  exact
                  to={item.link}
                  className="text-center font-serif"
                  activeClassName="text-black"
                  onClick={() => handleItemClick(`${item.name}`)}
                >
                  {item.label}
                </Link>
              </li>
          ))}
        </ul>
      </div>
    </div>

  )
}

export default Menu