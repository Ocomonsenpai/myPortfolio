import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const base = import.meta.env.BASE_URL || "/";
export const ASTEROID_GLB_URL = `${base.replace(/\/?$/, "/")}asteriod.glb`;

let asteroidGltfPromise = null;

function prepareAsteroidTemplate(gltf) {
  const root = gltf.scene;
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    root.scale.setScalar(3.5 / maxDim);
  }

  root.position.set(0, 0, 20);
  return gltf;
}

/**
 * Starts load + parse once; safe to call from main before React renders.
 * Hero mounts later and re-attaches the prepared scene (clone() breaks many GLTFs).
 */
export function preloadAsteroidGltf() {
  if (!asteroidGltfPromise) {
    const loader = new GLTFLoader();
    asteroidGltfPromise = new Promise((resolve, reject) => {
      loader.load(
        ASTEROID_GLB_URL,
        (gltf) => resolve(prepareAsteroidTemplate(gltf)),
        undefined,
        reject
      );
    });
  }
  return asteroidGltfPromise;
}
