// FileUpload.jsx
import React, { forwardRef } from "react";
import { MdFileUpload } from "react-icons/md";
import "./FileUpload.css";

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb,.bmp";
const FileUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => (
    <div className="file-upload">
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
          <MdFileUpload size={12} />
        </div>
      </div>
    </div>
  )
);

export default FileUpload;
