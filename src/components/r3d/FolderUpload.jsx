import React, { forwardRef, useCallback, useState } from "react";
import { MdFolderOpen } from "react-icons/md";
import PropTypes from "prop-types";
import LoadingBar from "../LoadingBar";
import "./FolderUpload.css";

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb,.bmp";

const FolderUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => {
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = useCallback(
      (event) => {
        const files = event.target.files;
        let processed = 0;
        const totalFiles = files.length;

        Array.from(files).forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            processed++;
            setUploadProgress((processed / totalFiles) * 100);
            if (processed === totalFiles) {
              onFileChange(event);
            }
          };
          reader.readAsArrayBuffer(file);
        });
      },
      [onFileChange]
    );

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadProgress(0);
        onDrop(e);
      },
      [onDrop]
    );

    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <div className="folder-upload">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          accept={ACCEPTED_FILE_TYPES}
          multiple
          webkitdirectory=""
          ref={ref}
          aria-label="폴더 업로드"
        />
        <div
          className="drag-drop-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragOver}
        >
          <button
            className="upload-button"
            onClick={handleUploadClick}
            aria-label="폴더 선택"
          >
            <MdFolderOpen size={24} />
          </button>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <LoadingBar progress={uploadProgress} />
        )}
      </div>
    );
  }
);

FolderUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  handleUploadClick: PropTypes.func.isRequired,
};

FolderUpload.displayName = "FolderUpload";

export default FolderUpload;
