import React, { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { DirectionalLight, Vector3 } from "three";
import OBJLoaderComponent from "./loaders/OBJLoaderComponent";
import FBXLoaderComponent from "./loaders/FBXLoaderComponent";
import STLLoaderComponent from "./loaders/STLLoaderComponent";
import PLYLoaderComponent from "./loaders/PLYLoaderComponent";
import TDSLoaderComponent from "./loaders/TDSLoaderComponent";
import DAELoaderComponent from "./loaders/DAELoaderComponent";
import PCDLoaderComponent from "./loaders/PCDLoaderComponent";
import GLBLoaderComponent from "./loaders/GLBLoaderComponent";
import ControlPanel from "./ControlPanel";
import Preview from "./Preview";
import "./ModelViewer.css";

const defaultCameraSettings = {
  position: new Vector3(0, 10, 40),
  fov: 39.5978,
  near: 0.1,
  far: 1000 * 3,
};

const DefaultLightList = [
  {
    name: "DefaultKeyLight",
    color: 0xfff2db,
    intensity: 1.4,
    position: new Vector3(6.7, 9.5, 8),
  },
  {
    name: "DefaultFillLight",
    color: 0xfdfdfd,
    intensity: 1,
    position: new Vector3(-10, 4.7, 5),
  },
  {
    name: "DefaultBackLight",
    color: 0xedfaff,
    intensity: 1,
    position: new Vector3(-3, 5, -10),
  },
];

const CameraAndLighting = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
    if (camera) {
      camera.position.copy(defaultCameraSettings.position);
      camera.fov = defaultCameraSettings.fov;
      camera.near = defaultCameraSettings.near;
      camera.far = defaultCameraSettings.far;
      camera.updateProjectionMatrix();
    }

    if (scene) {
      DefaultLightList.forEach((light) => {
        const dirLight = new DirectionalLight(light.color, light.intensity);
        dirLight.position.copy(light.position);
        scene.add(dirLight);
      });
    }
  }, [camera, scene]);

  return null;
};

const ModelLoader = ({ modelUrl, fileType, textures, mtlUrl }) => {
  const LoaderComponent = {
    fbx: FBXLoaderComponent,
    stl: STLLoaderComponent,
    ply: PLYLoaderComponent,
    obj: OBJLoaderComponent,
    "3ds": TDSLoaderComponent,
    dae: DAELoaderComponent,
    pcd: PCDLoaderComponent,
    glb: GLBLoaderComponent,
  }[fileType];

  return LoaderComponent ? (
    <LoaderComponent url={modelUrl} textures={textures} mtlUrl={mtlUrl} />
  ) : null;
};

const ModelViewer = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [textures, setTextures] = useState([]);
  const [mtlUrl, setMtlUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [ambientIntensity, setAmbientIntensity] = useState(0);
  const [pointIntensity, setPointIntensity] = useState(0);
  const [spotIntensity, setSpotIntensity] = useState(0);
  const [spotAngle, setSpotAngle] = useState(Math.PI / 4);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modelFileName, setModelFileName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const controlsRef = useRef();
  const canvasRef = useRef();

  const handleFiles = useCallback((files) => {
    const fileHandlers = {
      fbx: FBXLoaderComponent,
      stl: STLLoaderComponent,
      ply: PLYLoaderComponent,
      obj: OBJLoaderComponent,
      "3ds": TDSLoaderComponent,
      dae: DAELoaderComponent,
      pcd: PCDLoaderComponent,
      glb: GLBLoaderComponent,
    };

    const fileType = Object.keys(fileHandlers).find((type) =>
      files.some((file) => file.name.toLowerCase().endsWith(type))
    );

    if (!fileType) return;

    const modelFile = files.find((file) =>
      file.name.toLowerCase().endsWith(fileType)
    );
    const textureFiles = files.filter((file) =>
      ["jpg", "jpeg", "png", "tif"].includes(
        file.name.split(".").pop().toLowerCase()
      )
    );
    const mtlFile = files.find((file) =>
      file.name.toLowerCase().endsWith(".mtl")
    );

    setModelUrl(URL.createObjectURL(modelFile));
    setModelFileName(modelFile.name);
    setTextures(
      textureFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
    setMtlUrl(mtlFile ? URL.createObjectURL(mtlFile) : null);
    setFileType(fileType);
  }, []);

  useEffect(() => {
    return () => {
      // Clean up URLs when component unmounts
      [modelUrl, mtlUrl, ...textures.map((t) => t.url)].forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [modelUrl, mtlUrl, textures]);

  const handleFileUpload = (event) => {
    handleFiles(Array.from(event.target.files));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(Array.from(event.dataTransfer.files));
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleCapture = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      requestAnimationFrame(() => {
        const dataURL = canvas.toDataURL("image/jpg");

        setCapturedImage(dataURL);

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = modelFileName
          ? modelFileName.replace(/\.[^/.]+$/, "") + ".jpg"
          : "capture.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return (
    <div className="model-viewer-container">
      <div className="control-panel">
        <ControlPanel
          handleFileUpload={handleFileUpload}
          handleDrop={handleDrop}
          handleFileSelect={(selectedFiles) => {
            handleFiles(selectedFiles.map((file) => file.file));
          }}
          handleResetCamera={handleResetCamera}
          ambientIntensity={ambientIntensity}
          setAmbientIntensity={setAmbientIntensity}
          pointIntensity={pointIntensity}
          setPointIntensity={setPointIntensity}
          spotIntensity={spotIntensity}
          setSpotIntensity={setSpotIntensity}
          setBackgroundColor={setBackgroundColor}
          handleCapture={handleCapture}
        />
      </div>
      <div className="model-viewer-content">
        <Canvas
          className="model-canvas"
          ref={canvasRef}
          style={{ background: backgroundColor }}
        >
          <ambientLight intensity={ambientIntensity} />
          <pointLight position={[1, 1, 1]} intensity={pointIntensity} />
          <spotLight
            intensity={spotIntensity}
            angle={spotAngle}
            position={[10, 10, 10]}
          />
          <Environment preset="sunset" />
          <OrbitControls ref={controlsRef} />
          <CameraAndLighting />
          <ModelLoader
            modelUrl={modelUrl}
            fileType={fileType}
            textures={textures}
            mtlUrl={mtlUrl}
          />
        </Canvas>
      </div>
      <div className="preview-container">
        <Preview capturedImage={capturedImage} />
      </div>
    </div>
  );
};

export default ModelViewer;
