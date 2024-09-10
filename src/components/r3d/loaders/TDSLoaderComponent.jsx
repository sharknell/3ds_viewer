import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { Html } from "@react-three/drei";

const TDSLoaderComponent = ({ url }) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new TDSLoader();

    loader.load(
      url,
      (object) => {
        object.position.set(-7.5, -7.5, 0); // Example position adjustment
        object.scale.set(10, 10, 10); // Increase the scale to make the model larger

        setModel(object);
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

  if (!model) {
    return null;
  }

  return <primitive object={model} />;
};

export default TDSLoaderComponent;
