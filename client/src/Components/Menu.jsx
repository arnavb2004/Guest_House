import React from 'react'

const Menu = () => {
  return (
    <div className="menu w-full flex justify-center pt-2">
      <div className="menu-container w-7/12 px-6" style={{ background: 'linear-gradient(to bottom, #E8F4FF, #C7F4FF)' }}>
        <ul className="tabs flex justify-end gap-4">
          <li className='px-1 text-xl'>
            <p>Home</p>
          </li>
           
          <li className='px-1 text-xl'>
            <p>Dining</p>
          </li>
          
          <li className='px-1 text-xl'>
            <p>People</p>
          </li>

          <li className='px-1 text-xl'>
            <p>Location</p>
          </li>

          <li className='px-1 text-xl'>
            <p>Reservation</p>
          </li>

          <li className='px-1 text-xl'>
            <p>Contact</p>
          </li>
        </ul>
      </div>
    </div>

  )
}

export default Menu