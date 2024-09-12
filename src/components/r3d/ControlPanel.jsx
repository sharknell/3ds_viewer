import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import "./ControlPanel.css";
import LightingControlPanel from "./LightingControlPanel";
import FileUpload from "./FileUpload";
import FolderUpload from "./FolderUpload";
import ZipUpload from "./ZipUpload";
import {
  FaFile,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb";
const IMAGE_FILE_TYPES = ["jpg", "jpeg", "png", "tif"];

const FileGroupList = React.memo(
  ({
    fileGroups,
    selectedGroupIndex,
    handleGroupClick,
    deleteGroup,
    handlePrev,
    handleNext,
  }) => (
    <div className="file-list-container">
      <div className="navigation-buttons">
        <button
          onClick={handlePrev}
          disabled={selectedGroupIndex === 0}
          className="nav-button"
          aria-label="이전 그룹"
        >
          <FaChevronLeft /> 이전
        </button>
        <button
          onClick={handleNext}
          disabled={selectedGroupIndex === fileGroups.length - 1}
          className="nav-button"
          aria-label="다음 그룹"
        >
          다음 <FaChevronRight />
        </button>
      </div>
      <div className="file-list">
        {fileGroups.length > 0 && (
          <ul className="group-list">
            {fileGroups.map((group, groupIndex) => (
              <li
                key={groupIndex}
                className={`file-group ${
                  selectedGroupIndex === groupIndex ? "selected" : ""
                }`}
                onClick={() => handleGroupClick(groupIndex)}
              >
                <div className="group-header">
                  <h3 className="group-header-title">그룹 {groupIndex + 1}</h3>
                  <button
                    className="delete-group-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(groupIndex);
                    }}
                    aria-label={`그룹 ${groupIndex + 1} 삭제`}
                  >
                    <FaTrash /> 삭제
                  </button>
                </div>
                <ul className="file-list">
                  {group.map((fileObj, fileIndex) => (
                    <li key={fileIndex} className="file-item">
                      {IMAGE_FILE_TYPES.includes(
                        fileObj.file.name.split(".").pop().toLowerCase()
                      ) ? (
                        <FaImage
                          className="file-icon"
                          aria-label="이미지 파일"
                        />
                      ) : (
                        <FaFile className="file-icon" aria-label="일반 파일" />
                      )}
                      <p>{fileObj.file.name}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
);

const ControlPanel = ({
  handleFileSelect,
  handleResetCamera,
  ambientIntensity,
  setAmbientIntensity,
  pointIntensity,
  setPointIntensity,
  handleCapture,
  backgroundColor,
  setBackgroundColor,
}) => {
  const [fileGroups, setFileGroups] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const updateFiles = useCallback((files) => {
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
  }, []);

  const onFileChange = useCallback(
    (event) => {
      const files = event.target.files;
      updateFiles(files);
      event.target.value = ""; // Reset input field
    },
    [updateFiles]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      updateFiles(files);
    },
    [updateFiles]
  );

  const handleGroupClick = useCallback(
    (groupIndex) => {
      setSelectedGroupIndex(groupIndex);
      handleFileSelect(fileGroups[groupIndex]);
    },
    [fileGroups, handleFileSelect]
  );

  const handleUploadClick = useCallback((inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (fileGroups.length === 0) {
      alert("탐색할 파일이 없습니다.");
      return;
    }
    const newIndex = Math.min(selectedGroupIndex + 1, fileGroups.length - 1);
    setSelectedGroupIndex(newIndex);
    handleFileSelect(fileGroups[newIndex]);
  }, [fileGroups, selectedGroupIndex, handleFileSelect]);

  const handlePrev = useCallback(() => {
    if (fileGroups.length === 0) {
      alert("탐색할 파일이 없습니다.");
      return;
    }
    const newIndex = Math.max(selectedGroupIndex - 1, 0);
    setSelectedGroupIndex(newIndex);
    handleFileSelect(fileGroups[newIndex]);
  }, [fileGroups, selectedGroupIndex, handleFileSelect]);

  useEffect(() => {
    return () => {
      fileGroups.forEach((group) => {
        group.forEach((fileObj) => URL.revokeObjectURL(fileObj.url));
      });
    };
  }, [fileGroups]);

  const memoizedFileGroupList = useMemo(
    () => (
      <FileGroupList
        fileGroups={fileGroups}
        selectedGroupIndex={selectedGroupIndex}
        handleGroupClick={handleGroupClick}
        deleteGroup={(index) =>
          setFileGroups(fileGroups.filter((_, i) => i !== index))
        }
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    ),
    [fileGroups, selectedGroupIndex, handleGroupClick, handlePrev, handleNext]
  );

  return (
    <div className="control-panel">
      <h1>파일 및 폴더 업로드</h1>
      <div className="upload-section">
        <FileUpload
          onFileChange={onFileChange}
          handleUploadClick={() => handleUploadClick(fileInputRef)}
          onDrop={onDrop}
          ref={fileInputRef}
          acceptedFileTypes={ACCEPTED_FILE_TYPES}
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
      <div className="file-group-capture-section">{memoizedFileGroupList}</div>
      <LightingControlPanel
        keyLightIntensity={ambientIntensity}
        setKeyLightIntensity={setAmbientIntensity}
        fillLightIntensity={pointIntensity}
        setFillLightIntensity={setPointIntensity}
        handleResetCamera={handleResetCamera}
        handleCapture={handleCapture}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
    </div>
  );
};

export default ControlPanel;
