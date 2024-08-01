// App.js
import React, { useState } from "react";
import ModelViewer from "./components/r3d/ModelViewer";
import "./App.css";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="app">
      <ModelViewer selectedFile={selectedFile} className="left-panel" />
    </div>
  );
};

export default App;
