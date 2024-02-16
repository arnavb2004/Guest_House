import React, { useEffect } from "react";

const Dining = () => {
  
  return (
    <div className="dining w-7/12 grid grid-cols-4 my-10">
      <div className="content col-span-3 p-4">
        <p className="text-2xl">Welcome to Dining Page</p>
        <p className="font-serif">Dining Page content</p>
      </div>

      <div className="links col-span-1 p-4">
        <p className="text-2xl">Other links</p>
        <p className="font-serif">links</p>
      </div>
    </div>
  );
};

export default Dining;
