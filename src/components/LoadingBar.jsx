import React from "react";
import "./LoadingBar.css";

const LoadingBar = ({ progress }) => {
  return (
    <div className="loading-bar-container">
      <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      <div className="loading-text">{`${Math.round(progress)}%`}</div>
    </div>
  );
};

export default LoadingBar;
