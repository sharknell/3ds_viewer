import React from "react";
import "./Preview.css";

const Preview = ({ capturedImage }) => {
  return (
    <div className="preview-container">
      <h1 className="preview-title">Captured Image</h1>
      {capturedImage ? (
        <img
          src={capturedImage}
          alt="Captured Preview"
          className="preview-image"
        />
      ) : (
        <p className="no-preview">No Preview Available</p>
      )}
    </div>
  );
};

export default Preview;
