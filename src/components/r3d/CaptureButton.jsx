// CaptureButton.js
import React from "react";

const CaptureButton = ({ canvasRef, modelFileName }) => {
  const handleCapture = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      requestAnimationFrame(() => {
        const dataURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = modelFileName
          ? modelFileName.replace(/\.[^/.]+$/, "") + ".png"
          : "capture.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return <button onClick={handleCapture}>Capture</button>;
};

export default CaptureButton;
