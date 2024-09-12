import React, { forwardRef, useState, useCallback } from "react";
import { MdFileUpload } from "react-icons/md";
import "./FileUpload.css";

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb,.bmp";
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB in bytes

const FileUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => {
    const [dragActive, setDragActive] = useState(false);

    const processFiles = useCallback((files) => {
      const validFiles = Array.from(files).filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (validFiles.length < files.length) {
        alert("1GB를 초과하는 파일은 업로드할 수 없습니다.");
      }

      return validFiles;
    }, []);

    const handleFileChange = useCallback(
      (event) => {
        const validFiles = processFiles(event.target.files);
        onFileChange({ target: { files: validFiles } });
      },
      [onFileChange, processFiles]
    );

    const handleFileDrop = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const validFiles = processFiles(event.dataTransfer.files);
        onDrop({ dataTransfer: { files: validFiles } });
      },
      [onDrop, processFiles]
    );

    const handleDragOver = useCallback((event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
    }, []);

    return (
      <div className="file-upload">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          accept={ACCEPTED_FILE_TYPES}
          multiple
          ref={ref}
          aria-label="파일 업로드"
        />
        <div
          className={`drag-drop-area ${dragActive ? "drag-active" : ""}`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <button
            className="upload-button"
            onClick={handleUploadClick}
            aria-label="파일 선택"
          >
            <MdFileUpload size={24} />
          </button>
        </div>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
