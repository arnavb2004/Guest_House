import React, { useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import "./Slider.css";
import { useEffect } from "react";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";
import { ShimmerThumbnail } from "react-shimmer-effects";

import { sliderItems } from "../data";

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  // const [titleColor, setTitleColor] = useState("black");

  const [direct, setDirect] = useState("");

  const [show, setShow] = useState(false);

  const ref = useRef(0);

  const titleRef = useRef(0);

  useEffect(() => {
    ref.current.style.transform = `translateX(${-slideIndex * 100}vw)`;
  }, [slideIndex]);

  useEffect(() =>{

    const interval = setInterval(() => {
      handleClick("right");
    }, 5000);

    return () => clearInterval(interval);
  
  },[])

  const handleClick = (direction) => {
    setDirect(direction);
    setShow(true);

    direction === "left"
      ? setSlideIndex((slideIndex) =>
          slideIndex === 0 ? sliderItems.length - 1 : slideIndex - 1
        )
      : setSlideIndex((slideIndex) =>
          slideIndex === sliderItems.length - 1 ? 0 : slideIndex + 1
        );
  };

  return (
    <div className="slider-container mx-7 border border-black">
      <div className="arrow arrow-left">
        <KeyboardArrowLeftOutlinedIcon onClick={() => handleClick("left")} />
      </div>
      <div className="slide-wrapper " ref={ref}>
        {sliderItems.map((slide, i) => (
          <div className="slide" key={slide.id}>
            <div className="imgContainer">
              <img
                loading={i === 0 ? "eager" : "lazy"}
                src={slide.img}
                fetchpriority="high"
                alt=""
              />
            </div>
            {/* <div className="infoContainer"> */}
              {/* <Fade
                delay={50}
                appear
                opposite
                left={direct === "left"}
                right={direct === "right"}
                when={sliderItems[slideIndex] === slide}
              >
                <h1 className="slider-title">{slide.title}</h1>
              </Fade> */}
            {/* </div> */}
          </div>
        ))}
      </div>
      <div className="arrow arrow-right">
        <KeyboardArrowRightOutlinedIcon onClick={() => handleClick("right")} />
      </div>
    </div>
  );
};

export default Slider;
