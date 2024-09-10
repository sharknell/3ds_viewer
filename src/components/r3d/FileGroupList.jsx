import React from "react";
import PropTypes from "prop-types";
import "./FileGroupList.css";

const IMAGE_FILE_TYPES = ["jpg", "jpeg", "png", "tif"];
const PREV_BUTTON_TEXT = "PREV";
const NEXT_BUTTON_TEXT = "NEXT";
const DELETE_BUTTON_TEXT = "삭제";

const isImageFile = (fileName) =>
  IMAGE_FILE_TYPES.includes(fileName.split(".").pop().toLowerCase());

const FileItem = ({ file }) => (
  <li className="file-item">
    <p>{file.name}</p>
    {isImageFile(file.name) && <span className="image-indicator">이미지</span>}
  </li>
);

const FileGroup = ({
  group,
  index,
  isSelected,
  onGroupClick,
  onDeleteClick,
}) => (
  <li
    className={`file-group ${isSelected ? "selected" : ""}`}
    onClick={() => onGroupClick(index)}
  >
    <div className="group-header">
      <p className="group-header-title">Group {index + 1}</p>
      <button
        className="delete-group-button"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(index);
        }}
      >
        {DELETE_BUTTON_TEXT}
      </button>
    </div>
    <ul>
      {group.map((fileObj, fileIndex) => (
        <FileItem key={fileIndex} file={fileObj.file} />
      ))}
    </ul>
  </li>
);

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
        {PREV_BUTTON_TEXT}
      </button>
      <button
        onClick={handleNext}
        disabled={selectedGroupIndex === fileGroups.length - 1}
      >
        {NEXT_BUTTON_TEXT}
      </button>
    </div>
    <div className="file-list">
      {fileGroups.length > 0 && (
        <ul>
          {fileGroups.map((group, groupIndex) => (
            <FileGroup
              key={groupIndex}
              group={group}
              index={groupIndex}
              isSelected={selectedGroupIndex === groupIndex}
              onGroupClick={handleGroupClick}
              onDeleteClick={deleteGroup}
            />
          ))}
        </ul>
      )}
    </div>
  </div>
);

FileGroupList.propTypes = {
  fileGroups: PropTypes.arrayOf(PropTypes.array).isRequired,
  selectedGroupIndex: PropTypes.number.isRequired,
  handleGroupClick: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default FileGroupList;
