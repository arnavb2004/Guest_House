import React, { useEffect, useState } from "react";

const Text = () => {
  const [showHindi, setShowHindi] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHindi((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div>
      <a
        className='text-3xl text-justify min-w-max font-medium font-["Dosis"]'
        href="/"
      >
        <div className="flex flex-col h-9 py-1 ">
          <div className={!showHindi && "h-0 overflow-hidden"}>
            भारतीय प्रौद्योगिकी संस्थान रोपड़
          </div>
          <div className={showHindi && "h-0 overflow-hidden"}>
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </div>
        </div>
      </a>
    </div>
  );
};

export default Text;
