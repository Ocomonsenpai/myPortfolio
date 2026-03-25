import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Hero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 26);

    let asteriod;
    let mixer;
    const clock = new THREE.Clock();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(-100, 100, 100);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      "/asteriod.glb",
      (gltf) => {
        asteriod = gltf.scene;

        const box = new THREE.Box3().setFromObject(asteriod);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Center model at origin
        asteriod.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 4 / maxDim; // adjust size here
          asteriod.scale.setScalar(scale);
        }

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(asteriod);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // Center object at origin so it sits in middle of view
        asteriod.position.set(0, 0, 20);
        scene.add(asteriod);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB:", error);
      }
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const resizeRenderer = () => {
      const { clientWidth, clientHeight } = container;
      const width = clientWidth || window.innerWidth;
      const height = clientHeight || window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();
    container.appendChild(renderer.domElement);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(0.001);
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", resizeRenderer);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeRenderer);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="layout">
      <div id="container3D" className="container3D" ref={containerRef} />
      <div className="quote">
        <p>minimalism is not emptiness its essence</p>
      </div>
    </div>
  );
};

export default Hero;

