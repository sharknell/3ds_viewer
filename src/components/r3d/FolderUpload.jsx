// FolderUpload.jsx
import React, { forwardRef } from "react";
import { MdFolderOpen } from "react-icons/md";
import "./FolderUpload.css";

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb";

const FolderUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => (
    <div className="folder-upload">
      <input
        type="file"
        onChange={onFileChange}
        className="file-input"
        accept={ACCEPTED_FILE_TYPES}
        multiple
        webkitdirectory=""
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
          <MdFolderOpen size={12} />
        </div>
      </div>
    </div>
  )
);

export default FolderUpload;
