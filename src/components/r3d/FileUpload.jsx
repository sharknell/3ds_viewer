// FileUpload.jsx
import React, { forwardRef } from "react";
import "./ControlPanel.css";

const ACCEPTED_FILE_TYPES =
  ".fbx,.stl,.mtl,.obj,.ply,.dae,.3ds,.jpg,.jpeg,.png,.tif,.pcd,.glb";

const FileUpload = forwardRef(
  ({ onFileChange, onDrop, handleUploadClick }, ref) => (
    <div>
      <input
        type="file"
        onChange={onFileChange}
        className="file-input"
        accept={ACCEPTED_FILE_TYPES}
        multiple
        ref={ref} // ref를 추가하여 외부에서 접근 가능하게 함
      />
      <div
        className="drag-drop-area"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
      >
        <div className="upload-button" onClick={handleUploadClick}>
          <p>파일을 드래그 앤 드롭하거나 클릭하여 업로드하세요.</p>
        </div>
      </div>
    </div>
  )
);

export default FileUpload;
