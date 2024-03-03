import React, { useRef, useState, useEffect } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import styles from "./Slider2.module.css"; 

const Slider2 = ({ items }) => { // Assuming items is the array of images
  const [slideIndex, setSlideIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    ref.current.style.transform = `translateX(${-slideIndex * 100}vw)`;
  }, [slideIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(slideIndex === 0 ? items.length - 1 : slideIndex - 1);
    } else {
      setSlideIndex(slideIndex === items.length - 1 ? 0 : slideIndex + 1);
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => handleClick("left")}>
        <KeyboardArrowLeftOutlinedIcon />
      </div>
      <div className={styles.slideWrapper} ref={ref}>
        {items.map((item, i) => (
          <div className={styles.slide} key={item.key}>
            <div className={styles.imgContainer}>
              <img src={item.img} alt="" />
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => handleClick("right")}>
        <KeyboardArrowRightOutlinedIcon />
      </div>
    </div>
  );
};

export default Slider2;
