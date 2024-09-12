import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three";
import { Html } from "@react-three/drei";
import LoadingBar from "../../LoadingBar";

const useOBJLoader = (url, mtlUrl, textures) => {
  const [object, setObject] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);

  const applyTextures = useCallback(
    (obj) => {
      const textureLoader = new TextureLoader();
      textures.forEach((texture) => {
        const loadedTexture = textureLoader.load(texture.url);
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material.map = loadedTexture;
            child.material.needsUpdate = true;
          }
        });
      });
    },
    [textures]
  );

  useEffect(() => {
    let isMounted = true;
    const updateProgress = (xhr) => {
      if (isMounted) {
        setLoadingProgress((xhr.loaded / xhr.total) * 100);
      }
    };

    const loadModel = async () => {
      try {
        let materials;
        if (mtlUrl) {
          const mtlLoader = new MTLLoader();
          materials = await new Promise((resolve, reject) =>
            mtlLoader.load(mtlUrl, resolve, updateProgress, reject)
          );
          materials.preload();
        }

        const objLoader = new OBJLoader();
        if (materials) {
          objLoader.setMaterials(materials);
        }

        const loadedObject = await new Promise((resolve, reject) =>
          objLoader.load(url, resolve, updateProgress, reject)
        );

        if (isMounted) {
          applyTextures(loadedObject);
          setObject(loadedObject);
          setLoadingProgress(100);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading model:", err);
          setError(err);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [url, mtlUrl, applyTextures]);

  return { object, loadingProgress, error };
};

const OBJLoaderComponent = ({ url, textures = [], mtlUrl }) => {
  const { scene } = useThree();
  const objRef = useRef();
  const { object, loadingProgress, error } = useOBJLoader(
    url,
    mtlUrl,
    textures
  );

  useEffect(() => {
    if (object && objRef.current) {
      objRef.current.add(object);
      scene.add(objRef.current);
    }

    return () => {
      if (objRef.current) {
        scene.remove(objRef.current);
      }
    };
  }, [object, scene]);

  const loadingBar = useMemo(() => {
    if (loadingProgress > 0 && loadingProgress < 100) {
      return (
        <Html>
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "white",
              padding: "10px",
            }}
          >
            <LoadingBar progress={loadingProgress} />
          </div>
        </Html>
      );
    }
    return null;
  }, [loadingProgress]);

  if (error) {
    return (
      <Html>
        <div style={{ color: "red" }}>Error loading model: {error.message}</div>
      </Html>
    );
  }

  return (
    <>
      <group ref={objRef} />
      {loadingBar}
    </>
  );
};

export default OBJLoaderComponent;
