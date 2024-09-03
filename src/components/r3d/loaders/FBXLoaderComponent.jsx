import React, { useEffect, useState } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader, Box3, Vector3 } from "three";
import { Html } from "@react-three/drei";
import "./FBXLoaderComponent.css";

const FBXLoaderComponent = ({ url, textures }) => {
  const { camera } = useThree();
  const [fbx, setFbx] = useState(null);
  const [loadedTextures, setLoadedTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(
      url,
      (loadedFbx) => {
        console.log("FBX model loaded successfully");
        setFbx(loadedFbx);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading FBX model:", err);
        setError(err);
        setLoading(false);
      }
    );
  }, [url]);

  useEffect(() => {
    if (textures && textures.length > 0) {
      const textureLoader = new TextureLoader();
      const texturesPromises = textures.map((textureObj) => {
        return new Promise((resolve, reject) => {
          textureLoader.load(
            textureObj.url,
            (texture) => {
              texture.name = textureObj.name.split(".")[0];
              resolve(texture);
            },
            undefined,
            (err) => {
              console.error("Error loading texture:", err);
              reject(err);
            }
          );
        });
      });

      Promise.all(texturesPromises)
        .then((textures) => {
          setLoadedTextures(textures);
        })
        .catch((err) => {
          console.error("Error processing textures:", err);
          setError(err);
        });
    }
  }, [textures]);

  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          const texture = loadedTextures.find(
            (tex) => tex.name === child.material.name
          );
          if (texture) {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      });

      // Compute the bounding box of the model
      const box = new Box3().setFromObject(fbx);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      // Calculate the scale to fit the model within the desired size
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 1 / maxDimension;
      fbx.scale.set(scale, scale, scale);

      // Center the object
      fbx.position.sub(center);
      fbx.position.y = size.y / 2;

      // Adjust the camera to fit the scaled model
      const distance = Math.max(size.x, size.y, size.z) * 2;
      camera.position.set(0, distance, distance);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }
  }, [fbx, loadedTextures, camera]);

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
            Error loading model or textures: {error.message}
          </div>
        </div>
      </Html>
    );
  }

  if (!fbx) {
    return null;
  }

  return <primitive object={fbx} scale={0.01} />;
};

export default FBXLoaderComponent;
