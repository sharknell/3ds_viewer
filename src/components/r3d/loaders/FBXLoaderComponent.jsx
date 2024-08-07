import React, { useEffect, useState } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader, Box3, Vector3 } from "three";
import { Html } from "@react-three/drei";
import "./FBXLoaderComponent.css";

const FBXLoaderComponent = ({ url, textures }) => {
  const { camera } = useThree();
  const fbx = useLoader(FBXLoader, url);
  const [loadedTextures, setLoadedTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              reject(err);
            }
          );
        });
      });

      Promise.all(texturesPromises)
        .then((textures) => {
          setLoadedTextures(textures);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [textures]);

  useEffect(() => {
    if (fbx && loadedTextures.length > 0) {
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

      // Adjust camera's far clipping plane to increase rendering distance
      camera.far = 10000;
      camera.updateProjectionMatrix();

      // Center the object and adjust its position
      const box = new Box3().setFromObject(fbx);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());
      fbx.position.sub(center);
      fbx.position.y = size.y / 2;
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

  return <primitive object={fbx} scale={1} />;
};

export default FBXLoaderComponent;
