import React from "react";
import { Reuleaux } from "ldrs/react";
import "ldrs/react/Reuleaux.css";

const Loader = ({ size = "50", color = "#24363f", h= "h-64" }) => {
  return (
    <div className={`flex justify-center items-center w-full ${h}`}>
      <Reuleaux
        size={size}
        stroke="5"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.2"
        color={color}
      />
    </div>
  );
};

export default Loader;