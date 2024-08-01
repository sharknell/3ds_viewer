import React from "react";
import "./Preview.css";

const Preview = ({ capturedImage }) => {
  return (
    <div className="preview-container">
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured Preview"
          className="preview-image"
        />
      )}
    </div>
  );
};

export default Preview;
