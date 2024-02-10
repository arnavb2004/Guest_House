import React from 'react';

const Location = () => {
  return (
    <div className='location w-7/12 grid grid-cols-4'>
        <div className="content col-span-3 p-4">
            <p className='text-2xl'>Welcome to Location Page</p>
            <p className='font-serif'>Location Page content</p>
        </div>
        
        <div className="links col-span-1 p-4">
            <p className='text-2xl'>Other links</p>
            <p className='font-serif'>links</p>
        </div>
    </div>
  )
}

export default Location