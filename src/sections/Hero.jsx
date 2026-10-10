import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { preloadAsteroidGltf } from "../asteroidPreload.js";

const CAMERA_FOV = 19;
const CAMERA_Z = 26;
const NEAR = 0.1;
const FAR = 1000;
const ARRIVAL_DELAY_SECONDS = 0.5;

const Hero = ({ introReady = true }) => {
  const containerRef = useRef(null);
  const layoutRef = useRef(null);
  const renderReadyRef = useRef(introReady);

  useEffect(() => {
    const root = layoutRef.current;
    if (!root) return;
    renderReadyRef.current = introReady;

    const quote = root.querySelector(".hero-statement");
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        gsap.set(root, { scale: 1, opacity: 1 });
        if (quote) gsap.set(quote, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.registerPlugin(CustomEase);
      CustomEase.create("hop", "0.175, 0.885, 0.32, 1");
      gsap.set(root, { scale: 1, opacity: 0 });
      if (quote) gsap.set(quote, { yPercent: 110, opacity: 0 });
      if (!introReady) return;

      gsap.set(root, { opacity: 1 });
      if (quote) {
        gsap.to(quote, { yPercent: 0, opacity: 1, duration: 0.9, delay: 0.95 + ARRIVAL_DELAY_SECONDS, ease: "hop" });
      }
    }, root);

    return () => ctx.revert();
  }, [introReady]);

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
    let arrivalTimeline;
    let arrivalStarted = false;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const arrival = new THREE.Group();
    const previousFilter = container.style.filter;
    scene.add(arrival);
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

        arrival.add(asteroid);
        if (!motionPreference.matches) {
          // Keep the cached model's resting transform intact while it exits hyperspace.
          const approachDepth = 155;
          const approachDistance = CAMERA_Z - asteroid.position.z + approachDepth;
          const approachX = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * approachDistance * camera.aspect * 0.55;
          arrival.position.set(approachX, 3.5, -approachDepth);
          arrivalTimeline = gsap.timeline({
            paused: true,
            onComplete: () => { container.style.filter = previousFilter; },
          })
            .to(arrival.position, { x: 0, y: 0, z: 0.12, duration: 0.2, ease: "expo.in" }, 0.68 + ARRIVAL_DELAY_SECONDS)
            .to(arrival.position, { z: 0, duration: 0.24, ease: "power2.out" }, 0.88 + ARRIVAL_DELAY_SECONDS)
            .fromTo(container, { filter: "blur(0px)" }, { filter: "blur(5px)", duration: 0.04, ease: "power2.in" }, 0.8 + ARRIVAL_DELAY_SECONDS)
            .to(container, { filter: "blur(0px)", duration: 0.09, ease: "power2.out" }, 0.86 + ARRIVAL_DELAY_SECONDS);
        }
        if (!renderReadyRef.current) renderer.render(scene, camera);
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
      if (renderReadyRef.current) {
        if (arrivalTimeline && !arrivalStarted) {
          arrivalStarted = true;
          if (motionPreference.matches) {
            arrivalTimeline.progress(1).pause();
          } else {
            arrivalTimeline.play(0);
          }
        }
        if (mixer) mixer.update(0.001);
        renderer.render(scene, camera);
      }
    };
    animate();

    const onMotionChange = () => {
      if (!motionPreference.matches) return;
      arrivalStarted = true;
      arrivalTimeline?.progress(1).pause();
      arrival.position.set(0, 0, 0);
      container.style.filter = previousFilter;
    };
    motionPreference.addEventListener("change", onMotionChange);
    window.addEventListener("resize", resizeRenderer);

    return () => {
      cancelled = true;
      arrivalTimeline?.kill();
      motionPreference.removeEventListener("change", onMotionChange);
      container.style.filter = previousFilter;
      if (mixer) mixer.stopAllAction();
      if (asteroid) arrival.remove(asteroid);
      scene.remove(arrival);
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
        <h1 className="hero-statement max-w-5xl">
          <span className="hero-statement-line">I design and build</span>{" "}
          <span className="hero-statement-line">intuitive digital</span>{" "}
          <span className="hero-statement-line">experiences.</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
