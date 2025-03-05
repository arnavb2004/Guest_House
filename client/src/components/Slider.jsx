import React, { useState, useEffect } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import "./Slider.css";

const Slider = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-slide effect with proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  // Handle previous slide with proper wrapping
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % items.length
    );
  };

  return (
    <div className="slider-container mx-7 rounded-lg border-2 border-black relative overflow-hidden">
      <div className="arrow arrow-left">
        <KeyboardArrowLeftOutlinedIcon onClick={handlePrevious} />
      </div>
      <div 
        className="slide-wrapper"
        style={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        {items.map((slide, index) => (
          <div
            key={`slide-${slide.key}`}
            className="slide"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: index === activeIndex ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              zIndex: index === activeIndex ? 1 : 0
            }}
          >
            <div className="imgContainer">
              <img
                loading={index === 0 ? "eager" : "lazy"}
                src={slide.img}
                fetchpriority={index === 0 ? "high" : "auto"}
                alt={slide.alt || "Slider image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="arrow arrow-right">
        <KeyboardArrowRightOutlinedIcon onClick={handleNext} />
      </div>
      

      <div 
        style={{
          position: "absolute",
          bottom: "10px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        {items.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setActiveIndex(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: index === activeIndex ? "white" : "rgba(255,255,255,0.5)",
              border: "none",
              padding: 0,
              cursor: "pointer"
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;