import React, { forwardRef, useState } from "react";
import { MdArchive } from "react-icons/md";
import "./ZipUpload.css";

const ACCEPTED_FILE_TYPES = ".zip";
const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB

const ZipUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      processFiles(files);
    };

    const handleFileDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
      const files = Array.from(event.dataTransfer.files);
      processFiles(files);
    };

    const processFiles = (files) => {
      const zipFiles = files.filter((file) =>
        file.name.toLowerCase().endsWith(".zip")
      );
      const validFiles = zipFiles.filter((file) => file.size <= MAX_FILE_SIZE);

      if (validFiles.length < zipFiles.length) {
        alert("100MB를 초과하는 ZIP 파일은 업로드할 수 없습니다.");
      }

      if (validFiles.length === 0) {
        alert("유효한 ZIP 파일이 없습니다.");
        return;
      }

      onFileChange({ target: { files: validFiles } });
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(true);
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
    };

    return (
      <div className="zip-upload">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          accept={ACCEPTED_FILE_TYPES}
          multiple
          ref={ref}
          aria-label="ZIP 파일 업로드"
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
            aria-label="ZIP 파일 선택"
          >
            <MdArchive size={24} />
          </button>
        </div>
      </div>
    );
  }
);

ZipUpload.displayName = "ZipUpload";

export default ZipUpload;
