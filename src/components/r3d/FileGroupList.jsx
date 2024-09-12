import React from "react";
import "./FileGroupList.css";

const IMAGE_FILE_TYPES = ["jpg", "jpeg", "png", "tif", "bmp"];

const FileGroupList = ({
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
      >
        <FaChevronLeft /> 이전
      </button>
      <button
        onClick={handleNext}
        disabled={selectedGroupIndex === fileGroups.length - 1}
        className="nav-button"
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
                      <FaImage className="file-icon" />
                    ) : (
                      <FaFile className="file-icon" />
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
);

export default FileGroupList;
