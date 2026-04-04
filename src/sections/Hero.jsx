import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { preloadAsteroidGltf } from "../asteroidPreload.js";

const CAMERA_FOV = 19;
const CAMERA_Z = 26;
const NEAR = 0.1;
const FAR = 1000;

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

    const quote = root.querySelector(".hero-copy p");
    if (quote) {
      gsap.fromTo(
        quote,
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
      if (quote) gsap.killTweensOf(quote);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      NEAR,
      FAR
    );
    camera.position.set(0, 0, CAMERA_Z);

    let asteroid;
    let mixer;
    const timer = new THREE.Timer();
    timer.connect(document);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 5);
    sun.position.set(-100, 100, 100);
    scene.add(sun);

    let cancelled = false;
    preloadAsteroidGltf()
      .then((gltf) => {
        if (cancelled || !container) return;

        asteroid = gltf.scene;
        if (asteroid.parent) asteroid.parent.remove(asteroid);

        if (gltf.animations?.length > 0) {
          mixer = new THREE.AnimationMixer(asteroid);
          mixer.clipAction(gltf.animations[0]).play();
        }

        scene.add(asteroid);
      })
      .catch((err) => {
        if (!cancelled) console.error("Error loading GLB:", err);
      });

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const resizeRenderer = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
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
      if (asteroid) scene.remove(asteroid);
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeRenderer);
      timer.dispose();
      const el = renderer.domElement;
      if (el?.parentNode) el.parentNode.removeChild(el);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="layout" ref={layoutRef}>
      <div id="container3D" className="container3D" ref={containerRef} />
      <div className="quote hero-copy">
        <p>The best preparation for tomorrow is doing your best today.</p>
      </div>
    </div>
  );
};

export default Hero;
