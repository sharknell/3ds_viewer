import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { MeshStandardMaterial } from "three";
import { Html } from "@react-three/drei";

const STLLoaderComponent = ({ url }) => {
  const [geometry, setGeometry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new STLLoader();

    loader.load(
      url,
      (geometry) => {
        setGeometry(geometry);
        setLoading(false);
      },
      undefined,
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  }, [url]);

  if (loading) {
    return (
      <Html center>
        <div className="loader">Loading...</div>
      </Html>
    );
  }

  if (error) {
    return (
      <Html center>
        <div className="error-container">
          <div className="error-icon">❌</div>
          <div className="error-message">
            Error loading model: {error.message}
          </div>
        </div>
      </Html>
    );
  }

  if (!geometry) {
    return null;
  }

  return (
    <mesh geometry={geometry} scale={0.01}>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default STLLoaderComponent;
