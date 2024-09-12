import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader, Box3, Vector3 } from "three";
import { Html } from "@react-three/drei";
import "./FBXLoaderComponent.css";

const useModelLoader = (url, textures) => {
  const [fbx, setFbx] = useState(null);
  const [loadedTextures, setLoadedTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadModel = useCallback(() => {
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

  const loadTextures = useCallback(() => {
    if (textures && textures.length > 0) {
      const textureLoader = new TextureLoader();
      const texturesPromises = textures.map((textureObj) =>
        textureLoader.loadAsync(textureObj.url).then((texture) => {
          texture.name = textureObj.name.split(".")[0];
          return texture;
        })
      );

      Promise.all(texturesPromises)
        .then(setLoadedTextures)
        .catch((err) => {
          console.error("Error processing textures:", err);
          setError(err);
        });
    }
  }, [textures]);

  useEffect(() => {
    loadModel();
    loadTextures();
  }, [loadModel, loadTextures]);

  return { fbx, loadedTextures, loading, error };
};

const FBXLoaderComponent = ({ url, textures }) => {
  const { camera } = useThree();
  const { fbx, loadedTextures, loading, error } = useModelLoader(url, textures);

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

      const box = new Box3().setFromObject(fbx);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 1 / maxDimension;
      fbx.scale.set(scale, scale, scale);

      fbx.position.sub(center);
      fbx.position.y = size.y / 2;

      const distance = Math.max(size.x, size.y, size.z) * 2;
      camera.position.set(0, distance, distance);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }
  }, [fbx, loadedTextures, camera]);

  const content = useMemo(() => {
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
  }, [loading, error, fbx]);

  return content;
};

export default FBXLoaderComponent;
