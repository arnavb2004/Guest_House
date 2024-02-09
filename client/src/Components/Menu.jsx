import React from 'react'

const Menu = () => {
  return (
    <div className="menu w-full flex justify-center pt-2">
      <div className="menu-container w-7/12 px-6" style={{ background: 'linear-gradient(to bottom, white, #C7F4FF)' }}>
        <ul className="tabs flex justify-end px-6 gap-4">
          <li>
            <p>Home</p>
          </li>
           
          <li>
            <p>Dining</p>
          </li>
          <li>
            <p>People</p>
          </li>
          <li>
            <p>Location</p>
          </li>
          <li>
            <p>Reservation</p>
          </li>
          <li>
            <p>Contact</p>
          </li>
        </ul>
      </div>
    </div>

  )
}

export default Menu