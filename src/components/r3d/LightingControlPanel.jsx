import React, { useState, useCallback, useEffect } from "react";
import { SketchPicker } from "react-color";
import "./LightingControlPanel.css";

const LightingControlPanel = ({
  keyLightIntensity,
  setKeyLightIntensity,
  fillLightIntensity,
  setFillLightIntensity,
  shadowIntensity,
  setShadowIntensity,
  environmentMap,
  setEnvironmentMap,
  handleResetCamera,
  handleCapture,
  backgroundColor,
  setBackgroundColor,
}) => {
  const [color, setColor] = useState(backgroundColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = useCallback(
    (newColor) => {
      setColor(newColor.hex);
      setBackgroundColor(newColor.hex);
    },
    [setBackgroundColor]
  );

  const handleReset = useCallback(() => {
    const newState = {
      keyLightIntensity: 0,
      fillLightIntensity: 0,
      backgroundColor: "#ffffff",
      shadowIntensity: 0.5,
      environmentMap: "studio",
    };
    setKeyLightIntensity(newState.keyLightIntensity);
    setFillLightIntensity(newState.fillLightIntensity);
    setBackgroundColor(newState.backgroundColor);
    setColor(newState.backgroundColor);
    setShadowIntensity(newState.shadowIntensity);
    setEnvironmentMap(newState.environmentMap);
  }, [
    setKeyLightIntensity,
    setFillLightIntensity,
    setBackgroundColor,
    setShadowIntensity,
    setEnvironmentMap,
  ]);

  const handleLightIntensityChange = useCallback(
    (setter) => (e) => {
      setter(Number(e.target.value));
    },
    []
  );

  return (
    <div className="lighting-control-panel">
      <h2>조명 제어</h2>

      <div className="control">
        <label htmlFor="keyLight">주 조명 강도:</label>
        <input
          type="range"
          id="keyLight"
          value={keyLightIntensity}
          onChange={handleLightIntensityChange(setKeyLightIntensity)}
          min={-100}
          max={100}
          step={1}
        />
      </div>

      <div className="control">
        <label htmlFor="fillLight">보조 조명 강도:</label>
        <input
          type="range"
          id="fillLight"
          value={fillLightIntensity}
          onChange={handleLightIntensityChange(setFillLightIntensity)}
          min={-100}
          max={100}
          step={1}
        />
      </div>

      <div className="control">
        <label>배경색:</label>
        <button
          className="color-picker-button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{ backgroundColor: color }}
        >
          선택
        </button>
        {showColorPicker && (
          <div className="sketch-picker-container">
            <SketchPicker color={color} onChangeComplete={handleColorChange} />
          </div>
        )}
      </div>

      <div className="control">
        <label htmlFor="shadowIntensity">그림자 강도:</label>
        <input
          type="range"
          id="shadowIntensity"
          value={shadowIntensity}
          onChange={(e) => setShadowIntensity(Number(e.target.value))}
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      <div className="control">
        <label htmlFor="environmentMap">환경 맵:</label>
        <select
          id="environmentMap"
          value={environmentMap}
          onChange={(e) => setEnvironmentMap(e.target.value)}
        >
          <option value="studio">스튜디오</option>
          <option value="outdoor">야외</option>
          <option value="indoor">실내</option>
        </select>
      </div>

      <div className="button-group">
        <button className="reset-camera" onClick={handleResetCamera}>
          카메라 초기화
        </button>
        <button className="capture" onClick={handleCapture}>
          캡처
        </button>
      </div>

      <button className="reset-all" onClick={handleReset}>
        모든 설정 초기화
      </button>
    </div>
  );
};

export default React.memo(LightingControlPanel);
