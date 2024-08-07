import React, { useState, useRef, useEffect } from "react";
import "./ControlPanel.css";
import LightingControlPanel from "./LightingControlPanel";
import FileUpload from "./FileUpload";
import FolderUpload from "./FolderUpload";
import ZipUpload from "./ZipUpload"; // Import ZipUpload component

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb";
const IMAGE_FILE_TYPES = ["jpg", "jpeg", "png", "tif"];

const FileGroupList = ({
  fileGroups,
  selectedGroupIndex,
  handleGroupClick,
  deleteGroup,
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
  backgroundColor, // backgroundColor prop 추가
  setBackgroundColor, // setBackgroundColor prop 추가
}) => {
  const [fileGroups, setFileGroups] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const updateFiles = (files) => {
    const newGroups = {};

    Array.from(files).forEach((file) => {
      const pathParts = file.webkitRelativePath
        ? file.webkitRelativePath.split("/")
        : [];
      const folderName = pathParts.length > 1 ? pathParts[0] : "Ungrouped";

      if (!newGroups[folderName]) {
        newGroups[folderName] = [];
      }

      newGroups[folderName].push({
        file,
        url: URL.createObjectURL(file),
      });
    });

    setFileGroups((prevGroups) => [...prevGroups, ...Object.values(newGroups)]);
  };

  const onFileChange = (event) => {
    const files = event.target.files;
    updateFiles(files);
    event.target.value = ""; // Reset input field
  };

  const onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    updateFiles(files);
  };

  const handleGroupClick = (groupIndex) => {
    setSelectedGroupIndex(groupIndex);
    handleFileSelect(fileGroups[groupIndex]);
  };

  const handleUploadClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleNext = () => {
    if (fileGroups.length === 0) {
      alert("No files to navigate.");
      return;
    }
    const newIndex = Math.min(selectedGroupIndex + 1, fileGroups.length - 1);
    setSelectedGroupIndex(newIndex);
    handleFileSelect(fileGroups[newIndex]);
  };

  const handlePrev = () => {
    if (fileGroups.length === 0) {
      alert("No files to navigate.");
      return;
    }
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
      <h1>파일 및 폴더 업로드</h1>
      <div className="upload-section">
        <FileUpload
          onFileChange={onFileChange}
          handleUploadClick={() => handleUploadClick(fileInputRef)}
          onDrop={onDrop}
          ref={fileInputRef}
        />
        <FolderUpload
          onFileChange={onFileChange}
          onDrop={onDrop}
          handleUploadClick={() => handleUploadClick(folderInputRef)}
          ref={folderInputRef}
        />
        <ZipUpload
          onFileChange={onFileChange}
          onDrop={onDrop}
          handleUploadClick={() => handleUploadClick(zipInputRef)}
          ref={zipInputRef}
        />
      </div>
      <div className="file-group-capture-section">
        <FileGroupList
          fileGroups={fileGroups}
          selectedGroupIndex={selectedGroupIndex}
          handleGroupClick={handleGroupClick}
          deleteGroup={(index) =>
            setFileGroups(fileGroups.filter((_, i) => i !== index))
          }
        />
        <div className="capture-and-navigation">
          <div className="navigation-buttons">
            <button
              onClick={handlePrev}
              disabled={fileGroups.length === 0 || selectedGroupIndex === 0}
            >
              PREV
            </button>
            <button
              onClick={handleNext}
              disabled={
                fileGroups.length === 0 ||
                selectedGroupIndex === fileGroups.length - 1
              }
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
      <LightingControlPanel
        keyLightIntensity={ambientIntensity}
        setKeyLightIntensity={setAmbientIntensity}
        fillLightIntensity={pointIntensity}
        setFillLightIntensity={setPointIntensity}
        handleResetCamera={handleResetCamera}
        handleCapture={handleCapture}
        backgroundColor={backgroundColor} // backgroundColor 전달
        setBackgroundColor={setBackgroundColor} // setBackgroundColor 전달
      />
    </div>
  );
};

export default ControlPanel;
