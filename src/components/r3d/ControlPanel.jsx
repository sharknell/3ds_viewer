// ControlPanel.js
import React, { useState, useRef, useEffect } from "react";
import "./ControlPanel.css";
import LightingControlPanel from "./LightingControlPanel";
import FileUpload from "./FileUpload"; // FileUpload 컴포넌트 import

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb";
const IMAGE_FILE_TYPES = ["jpg", "jpeg", "png", "tif"];

const FileGroupList = ({
  fileGroups,
  selectedGroupIndex,
  handleGroupClick,
  deleteGroup,
  handlePrev,
  handleNext,
}) => (
  <div className="file-list-container">
    <div className="file-list">
      {fileGroups.length > 0 && (
        <ul>
          {fileGroups.map((group, groupIndex) => (
            <li
              key={groupIndex}
              className={`file-group ${
                selectedGroupIndex === groupIndex ? "selected" : ""
              }`}
              onClick={() => handleGroupClick(groupIndex)}
            >
              <div className="group-header">
                <p className="group-header-title">Group {groupIndex + 1}</p>
                <button
                  className="delete-group-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup(groupIndex);
                  }}
                >
                  삭제
                </button>
              </div>
              <ul>
                {group.map((fileObj, fileIndex) => (
                  <li key={fileIndex} className="file-item">
                    <p>{fileObj.file.name}</p>
                    {IMAGE_FILE_TYPES.includes(
                      fileObj.file.name.split(".").pop().toLowerCase()
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="navigation-buttons">
      <button onClick={handlePrev} disabled={selectedGroupIndex === 0}>
        PREV
      </button>
      <button
        onClick={handleNext}
        disabled={selectedGroupIndex === fileGroups.length - 1}
      >
        NEXT
      </button>
    </div>
  </div>
);

const ControlPanel = ({
  handleFileSelect,
  handleResetCamera,
  ambientIntensity,
  setAmbientIntensity,
  pointIntensity,
  setPointIntensity,
  handleCapture,
}) => {
  const [fileGroups, setFileGroups] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const fileInputRef = useRef(null);

  const updateFiles = (newFiles) => {
    const newFileGroup = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFileGroups((prevGroups) => [...prevGroups, newFileGroup]);
  };

  const deleteGroup = (groupIndex) => {
    setFileGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      updatedGroups.splice(groupIndex, 1);
      return updatedGroups;
    });
    setSelectedGroupIndex((prevIndex) =>
      groupIndex === prevIndex ? 0 : Math.max(prevIndex - 1, 0)
    );
  };

  const onFileChange = (event) => {
    const newFiles = [...event.target.files];
    updateFiles(newFiles);
    event.target.value = ""; // 인풋 필드 초기화
  };

  const onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFiles = [...event.dataTransfer.files];
    updateFiles(newFiles);
  };

  const handleGroupClick = (groupIndex) => {
    setSelectedGroupIndex(groupIndex);
    handleFileSelect(fileGroups[groupIndex]);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNext = () => {
    const newIndex = Math.min(selectedGroupIndex + 1, fileGroups.length - 1);
    setSelectedGroupIndex(newIndex);
    handleFileSelect(fileGroups[newIndex]);
  };

  const handlePrev = () => {
    const newIndex = Math.max(selectedGroupIndex - 1, 0);
    setSelectedGroupIndex(newIndex);
    handleFileSelect(fileGroups[newIndex]);
  };

  useEffect(() => {
    return () => {
      fileGroups.forEach((group) => {
        group.forEach((fileObj) => URL.revokeObjectURL(fileObj.url));
      });
    };
  }, [fileGroups]);

  return (
    <div className="control-panel">
      <h1>파일 목록</h1>
      <FileUpload
        onFileChange={onFileChange}
        onDrop={onDrop}
        handleUploadClick={handleUploadClick}
        ref={fileInputRef} // ref 전달
      />
      <FileGroupList
        fileGroups={fileGroups}
        selectedGroupIndex={selectedGroupIndex}
        handleGroupClick={handleGroupClick}
        deleteGroup={deleteGroup}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <button className="capture-button" onClick={handleCapture}>
        Capture
      </button>
      <LightingControlPanel
        keyLightIntensity={ambientIntensity}
        setKeyLightIntensity={setAmbientIntensity}
        fillLightIntensity={pointIntensity}
        setFillLightIntensity={setPointIntensity}
        handleResetCamera={handleResetCamera}
        handleCapture={handleCapture}
      />
    </div>
  );
};

export default ControlPanel;
