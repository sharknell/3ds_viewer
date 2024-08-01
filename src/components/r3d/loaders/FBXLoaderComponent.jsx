import React, { useEffect, useState } from "react";
import { useFBX } from "@react-three/drei";
import { TextureLoader } from "three";
import { Html } from "@react-three/drei";
import "./FBXLoaderComponent.css";

const FBXLoaderComponent = ({ url, textures }) => {
  const fbx = useFBX(url);
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
    }
  }, [fbx, loadedTextures]);

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
            Error loading textures: {error.message}
          </div>
        </div>
      </Html>
    );
  }

  if (!fbx) {
    return null;
  }

  return <primitive object={fbx} scale={0.1} />;
};

export default FBXLoaderComponent;
