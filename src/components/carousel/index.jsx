import React, { useState, useEffect, useRef } from "react";
import { useDrag } from 'react-use-gesture'
import "./index.scss";

function Carousel() {
  const [count, setCount] = useState(1);
  const [transitionToggle, setTransitionToggle] = useState(true);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [drag, setDrag] = useState(0)

  useEffect(() => {
      console.log(drag)
  }, [drag])

  const pointRef = useRef();

  switch (count) {
    case 0:
      pointRef.current = 3;
      break;
    case 4:
      pointRef.current = 1;
      break;
    default:
      pointRef.current = count;
  }

  useEffect(() => {
    count === 4 &&
      setTimeout(() => {
        setTransitionToggle(false);
        setCount(1);
      }, 300);
    count === 0 &&
      setTimeout(() => {
        setTransitionToggle(false);
        setCount(3);
      }, 300);
  }, [count]);

  //sider
  const handlePreClick = () => {
    setTransitionToggle(true);
    setCount((count) => (count === 0 ? 4 : (count - 1) % 5));
    //0.3s内无法操作
    setButtonDisable(true);
    setTimeout(() => setButtonDisable(false), 300);
  };
  const handleNextClick = () => {
    setTransitionToggle(true);
    setCount((count) => {
      return (count + 1) % 5;
    });
    setButtonDisable(true);
    setTimeout(() => setButtonDisable(false), 300);
  };

  //pointClick
  const handlePointClick = (n) => {
    setTransitionToggle(true);
    setCount(n);
  };

  //styel
  const style = {
    transform: `translateX(calc(${-count * 20}% + ${drag}px))`,
    transition: transitionToggle ? "transform .3s ease" : "none",
  };

  //drag
  const bind = useDrag(({down, movement: [mx, ], distance, cancel}) => {
        setDrag( down ? mx : 0)
        if(down && distance > window.innerWidth / 5){
            setTransitionToggle(true);
            cancel(mx > 0 ? handlePreClick() : handleNextClick())
        }
  })

  //每一页的内容
  const content = [3, 1, 2, 3, 1];

  return (
    <div className="carousel">
      <div className="hero" style={style} {...bind()}>
        {content.map((item, index) => (
          <div className="item" key={index}>
            {item}
          </div>
        ))}
      </div>
      <div className="points">
        {content.map((_, index) => (
          <div
            className="point"
            onClick={buttonDisable ? null : () => handlePointClick(index)}
            ref={pointRef}
            style={{
              backgroundColor:
                pointRef.current === index ? "lightsalmon" : "white",
            }}
          ></div>
        ))}
      </div>
      <div className="siders">
        <div
          className="sider left"
          onClick={buttonDisable ? null : handlePreClick}
        ></div>
        <div
          className="sider right"
          onClick={buttonDisable ? null : handleNextClick}
        ></div>
      </div>
    </div>
  );
}

export default Carousel;
