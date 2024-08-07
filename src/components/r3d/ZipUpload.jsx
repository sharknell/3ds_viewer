// ZipUpload.jsx
import React, { forwardRef } from "react";
import { MdArchive } from "react-icons/md";
import "./ZipUpload.css";

const ACCEPTED_FILE_TYPES = ".zip";

const ZipUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => (
    <div className="zip-upload">
      <input
        type="file"
        onChange={onFileChange}
        className="file-input"
        accept={ACCEPTED_FILE_TYPES}
        multiple
        ref={ref}
      />
      <div
        className="drag-drop-area"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
      >
        <div className="upload-button" onClick={handleUploadClick}>
          <MdArchive size={12} />
        </div>
      </div>
    </div>
  )
);

export default ZipUpload;
