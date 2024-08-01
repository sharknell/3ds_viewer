// PLYLoaderComponent.js
import React, { useEffect, useRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";

const PLYLoaderComponent = ({ url, textures, setSelectedObject }) => {
  const geometry = useLoader(PLYLoader, url);
  const meshRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (meshRef.current && typeof setSelectedObject === "function") {
      setSelectedObject(meshRef.current);
    }
  }, [setSelectedObject]);

  useEffect(() => {
    if (!geometry) return;

    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
      color: "white",
      vertexColors: true,
    });

    if (textures && textures.length > 0) {
      textureLoader.load(textures[0].url, (texture) => {
        material.map = texture;
        if (meshRef.current) {
          meshRef.current.material = material;
        }
      });
    } else {
      if (meshRef.current) {
        meshRef.current.material = material;
      }
    }
  }, [geometry, textures]);

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      {/* Optional: Add any other components or settings for the mesh */}
    </mesh>
  );
};

export default PLYLoaderComponent;
