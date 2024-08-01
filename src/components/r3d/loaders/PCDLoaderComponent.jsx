import React, { useEffect, useState, useRef } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { Box3, Vector3 } from "three";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const PCDLoaderComponent = ({ url }) => {
  const { scene, camera } = useThree();
  const pcd = useLoader(PCDLoader, url);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const groupRef = useRef(new THREE.Group());

  useEffect(() => {
    if (pcd) {
      setLoading(false);

      // PCD 파일을 그룹에 추가
      const group = groupRef.current;
      group.clear();
      group.add(pcd);
      scene.add(group);

      // PCD 파일의 경계 상자를 계산
      const box = new Box3().setFromObject(pcd);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);

      // 카메라 위치와 방향 설정
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
    } else {
      setError(new Error("Failed to load PCD file"));
    }

    return () => {
      const group = groupRef.current;
      group.clear();
      scene.remove(group);
    };
  }, [pcd, scene, camera]);

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
            Error loading PCD file: {error.message}
          </div>
        </div>
      </Html>
    );
  }

  if (!pcd) {
    return null;
  }

  return <primitive object={groupRef.current} />;
};

export default PCDLoaderComponent;
