import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three";

const OBJLoaderComponent = ({ url, textures = [], mtlUrl }) => {
  const { scene } = useThree();
  const objRef = useRef();

  // MTL 및 OBJ 파일 로드
  useEffect(() => {
    let currentObject = null;

    const loadModel = () => {
      if (mtlUrl) {
        const mtlLoader = new MTLLoader();
        mtlLoader.load(mtlUrl, (materials) => {
          materials.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load(url, (object) => {
            if (objRef.current) {
              // 이전 객체 제거
              if (currentObject) {
                objRef.current.remove(currentObject);
              }
              // 새 객체 추가 및 텍스처 적용
              applyTextures(object);
              objRef.current.add(object);
              currentObject = object;
            }
          });
        });
      } else {
        const objLoader = new OBJLoader();
        objLoader.load(url, (object) => {
          if (objRef.current) {
            // 이전 객체 제거
            if (currentObject) {
              objRef.current.remove(currentObject);
            }
            // 새 객체 추가 및 텍스처 적용
            applyTextures(object);
            objRef.current.add(object);
            currentObject = object;
          }
        });
      }
    };

    loadModel();

    return () => {
      // 컴포넌트가 언마운트될 때 객체 제거
      if (currentObject && objRef.current) {
        objRef.current.remove(currentObject);
      }
    };
  }, [url, mtlUrl]);

  // 텍스처 적용
  const applyTextures = (object) => {
    if (textures.length > 0) {
      const textureLoader = new TextureLoader();
      object.traverse((child) => {
        if (child.isMesh) {
          textures.forEach((texture) => {
            const loadedTexture = textureLoader.load(
              texture.url,
              () => {
                child.material.map = loadedTexture;
                child.material.needsUpdate = true;
              },
              undefined,
              (error) => {
                console.error(`Failed to load texture: ${texture.url}`, error);
              }
            );
          });
        }
      });
    }
  };

  return <group ref={objRef} />;
};

export default OBJLoaderComponent;
