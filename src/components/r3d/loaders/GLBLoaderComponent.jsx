import React, { useEffect, useRef } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Vector3, DirectionalLight } from "three";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const cameraInitPos = new Vector3(0, 10, 40);
const propCameraFov = 39.5978;
const propCameraNear = 0.1;
const propCameraFar = 1000 * 3; // 3km

const DefaultLightList = [
  {
    name: "DefaultKeyLight",
    assetMetaList: {
      color: 0xfff2db,
      intensity: 1.4,
      position: new Vector3(6.7, 9.5, 8),
    },
  },
  {
    name: "DefaultFillLight",
    assetMetaList: {
      color: 0xfdfdfd,
      intensity: 1,
      position: new Vector3(-10, 4.7, 5),
    },
  },
  {
    name: "DefaultBackLight",
    assetMetaList: {
      color: 0xedfaff,
      intensity: 1,
      position: new Vector3(-3, 5, -10),
    },
  },
];

const GLBLoaderComponent = ({ url }) => {
  const { scene, camera } = useThree();
  const gltf = useLoader(GLTFLoader, url);
  const group = useRef(new THREE.Group());

  useEffect(() => {
    // Apply default camera settings
    camera.position.copy(cameraInitPos);
    camera.fov = propCameraFov;
    camera.near = propCameraNear;
    camera.far = propCameraFar;
    camera.updateProjectionMatrix();

    // Add default lights to the scene
    DefaultLightList.forEach((lightInfo) => {
      const { color, intensity, position } = lightInfo.assetMetaList;
      const light = new DirectionalLight(color, intensity);
      light.position.copy(position);
      scene.add(light);
    });

    if (gltf) {
      const model = gltf.scene;
      group.current.add(model);
      scene.add(group.current);

      // Calculate model bounding box
      const box = new Box3().setFromObject(model);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);

      // Set camera position and orientation
      const maxDimension = Math.max(size.x, size.y, size.z);
      const fitHeightDistance =
        maxDimension / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = Math.max(fitHeightDistance, fitWidthDistance);

      const direction = new Vector3()
        .subVectors(camera.position, center)
        .normalize();
      camera.position.copy(direction.multiplyScalar(distance).add(center));
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }

    return () => {
      // Cleanup on unmount
      scene.remove(group.current);
      group.current.clear();

      // Remove lights
      scene.children.forEach((child) => {
        if (child instanceof DirectionalLight) {
          scene.remove(child);
        }
      });
    };
  }, [gltf, scene, camera]);

  if (!gltf) {
    return (
      <Html center>
        <div className="loader">Loading...</div>
      </Html>
    );
  }

  return <primitive object={group.current} />;
};

export default GLBLoaderComponent;
