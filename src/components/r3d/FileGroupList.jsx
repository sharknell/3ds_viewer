import React from "react";
import "./FileGroupList.css";

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
                    ) && (
                      <img
                        src={fileObj.url}
                        alt={fileObj.file.name}
                        className="file-preview"
                      />
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

export default FileGroupList;
