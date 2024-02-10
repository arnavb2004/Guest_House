import React from 'react';
import IITLogo from '../images/IIT-logo.png'

const Header = () => {
  return (
    <div className="header flex justify-center py-4">
      <div className="header-container w-7/12 h-32 flex justify-between py-2">
        <div className='w-56 flex flex-col justify-end'>
            {/* <img src="" alt="" /> */}
            <a className='font-["Single Day"] text-4xl font-bold' href="/">Guest House</a>
            <a className='text-3xl' href='/'>IIT Ropar</a>
        </div>
        <div className='py-2'>

        </div>
        <div className='w-28 h-32 py-2'>
            <img className='' src={IITLogo} alt="IIT Ropar logo" />
        </div>
      </div>
    </div>
  )
}

export default Header