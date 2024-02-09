import React from 'react';
import IITLogo from '../images/IIT-logo.png'
import Menu from './Menu';

const Header = () => {
  return (
    <div className="header flex flex-col items-center py-4 gap-3">
      <div className="header-container w-7/12 h-32 flex justify-between py-2">
        <div className='w-56 flex flex-col justify-end'>
            {/* <img src="" alt="" /> */}
            <p className='font-["Single Day"] text-4xl font-bold'>Guest House</p>
            <p className='text-3xl'>IIT Ropar</p>
        </div>
        <div className='py-2'>

        </div>
        <div className='w-28 h-32 py-2'>
            <img className='' src={IITLogo} alt="IIT Ropar logo" />
        </div>
      </div>
      <Menu/>
    </div>
  )
}

export default Header