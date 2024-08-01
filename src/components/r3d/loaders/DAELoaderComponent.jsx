import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { TextureLoader } from "three";
import { Html } from "@react-three/drei";

const DAELoaderComponent = ({ url, textures }) => {
  const collada = useLoader(ColladaLoader, url);
  const [loadedTextures, setLoadedTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTextures = async () => {
      if (textures && textures.length > 0) {
        try {
          const textureLoader = new TextureLoader();
          const texturePromises = textures.map((textureObj) =>
            textureLoader.loadAsync(textureObj.url).then((texture) => {
              texture.name = textureObj.name.split(".")[0];
              return texture;
            })
          );
          const loaded = await Promise.all(texturePromises);
          setLoadedTextures(loaded);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadTextures();
  }, [textures]);

  useEffect(() => {
    if (collada && loadedTextures.length > 0) {
      collada.scene.traverse((child) => {
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
  }, [collada, loadedTextures]);

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

  if (!collada) {
    return null;
  }

  return <primitive object={collada.scene} scale={0.1} />;
};

export default DAELoaderComponent;
