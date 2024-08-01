import React from "react";
import "./LightingControlPanel.css";

const LightingControlPanel = ({
  keyLightIntensity,
  setKeyLightIntensity,
  fillLightIntensity,
  setFillLightIntensity,
  handleResetCamera,
  handleCapture,
}) => {
  return (
    <div className="lighting-control-panel">
      <div className="control">
        <label>Key Light Intensity:</label>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={keyLightIntensity}
          onChange={(e) => setKeyLightIntensity(parseFloat(e.target.value))}
        />
        <input
          type="number"
          min="-10"
          max="10"
          step="0.1"
          value={keyLightIntensity}
          onChange={(e) => setKeyLightIntensity(parseFloat(e.target.value))}
        />
      </div>

      <div className="control">
        <label>Fill Light Intensity:</label>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={fillLightIntensity}
          onChange={(e) => setFillLightIntensity(parseFloat(e.target.value))}
        />
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={fillLightIntensity}
          onChange={(e) => setFillLightIntensity(parseFloat(e.target.value))}
        />
      </div>
      <div className="button-group">
        <button onClick={handleResetCamera}>Reset Camera</button>
      </div>
    </div>
  );
};

export default LightingControlPanel;
