import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { preloadAsteroidGltf } from "../asteroidPreload.js";
import { CustomEase } from "gsap/all";

const Hero = () => {
  const containerRef = useRef(null);
  const layoutRef = useRef(null);

  useEffect(() => {
    const root = layoutRef.current;
    if (!root) return;

    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.175, 0.885, 0.32, 1");

    gsap.set(root, { scale: 1.25 });
    gsap.to(root, {
      scale: 1,
      duration: 2,
      delay: 0.5,
      ease: "hop",
    });

    const copy = root.querySelector(".hero-copy p");
    if (copy) {
      gsap.fromTo(
        copy,
        { y: "110%", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.75,
          ease: "hop",
        }
      );
    }

    return () => {
      gsap.killTweensOf(root);
      if (copy) gsap.killTweensOf(copy);
    };
  }, []);

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
    const timer = new THREE.Timer();
    timer.connect(document);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(-100, 100, 100);
    scene.add(directionalLight);

    let cancelled = false;
    preloadAsteroidGltf()
      .then((gltf) => {
        if (cancelled || !container) return;

        asteriod = gltf.scene;
        if (asteriod.parent) {
          asteriod.parent.remove(asteriod);
        }

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(asteriod);
          mixer.clipAction(gltf.animations[0]).play();
        }

        scene.add(asteriod);
      })
      .catch((error) => {
        if (!cancelled) console.error("Error loading GLB:", error);
      });

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
    const animate = (time) => {
      frameId = requestAnimationFrame(animate);
      timer.update(time);
      if (mixer) mixer.update(0.001);
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", resizeRenderer);

    return () => {
      cancelled = true;
      if (mixer) mixer.stopAllAction();
      if (asteriod) scene.remove(asteriod);
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeRenderer);
      timer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="layout" ref={layoutRef}>
      <div id="container3D" className="container3D" ref={containerRef} />
      <div className="quote hero-copy">
        <p>minimalism is not emptiness its essence</p>
      </div>
    </div>
  );
};

export default Hero;

