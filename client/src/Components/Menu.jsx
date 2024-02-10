import React from 'react'

const Menu = () => {
  return (
    <div className="menu w-full flex justify-center pt-2">
      <div className="menu-container w-7/12 pr-3" style={{ background: 'linear-gradient(to bottom, #E8F4FF, #B4E6FF)' }}>
        <ul className="tabs flex justify-end">
          <li className='pr-2 text-xl'>
            <a href='/'>Home</a>
          </li>
           
          <li className='px-2 text-xl'>
            <a href='/dining'>Dining</a>
          </li>
          
          <li className='px-2 text-xl'>
            <a href='/people'>People</a>
          </li>

          <li className='px-2 text-xl'>
            <a href='/location'>Location</a>
          </li>

          <li className='px-2 text-xl'>
            <a href='/reservation'>Reservation</a>
          </li>

          <li className='pl-2 text-xl'>
            <a href='/contact'>Contact</a>
          </li>
        </ul>
      </div>
    </div>

  )
}

export default Menu