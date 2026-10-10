import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const HALF_SIZE = 4.2;
const CELL_COUNT = 5;
const CELL_SIZE = (HALF_SIZE * 2) / CELL_COUNT;
const SEGMENT_LENGTH = 3.2;
const TILE_COLORS = ["#6545a6", "#176ec0", "#ba861e", "#178361", "#b63949"];
const IMAGE_FILES = ["PP1.jpg", "PP2.jpg", "PP3.jpg", "PP4.jpg", "img1.png", "img2.png", "img3.png", "img4.png", "img8.png", "img9.png"];

export default function LightSpeedTransition({ active, onReveal, onComplete }) {
  const rootRef = useRef(null);
  const playRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || reducedMotion.matches) {
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const compact = window.innerWidth < 768;
    const rowCount = compact ? 16 : 24;
    const depth = rowCount * SEGMENT_LENGTH;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f0f0f, 0.035);
    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, depth + 20);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0f0f0f, 1);
    root.appendChild(renderer.domElement);

    let cancelled = false;
    let playing = false;
    let randomSeed = 27;
    const random = () => {
      randomSeed = (randomSeed * 16807) % 2147483647;
      return (randomSeed - 1) / 2147483646;
    };

    const textures = [];
    const textureLoader = new THREE.TextureLoader();
    const photoMaterials = IMAGE_FILES.map((file, index) => {
      const texture = textureLoader.load(`${import.meta.env.BASE_URL}${file}`, (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        // The fast-moving tiles only need small textures, including on Retina displays.
        const image = loaded.image;
        const scale = Math.min(1, 512 / Math.max(image.width, image.height));
        const thumbnail = document.createElement("canvas");
        thumbnail.width = Math.max(1, Math.round(image.width * scale));
        thumbnail.height = Math.max(1, Math.round(image.height * scale));
        thumbnail.getContext("2d").drawImage(image, 0, 0, thumbnail.width, thumbnail.height);
        loaded.image = thumbnail;
        loaded.needsUpdate = true;
        if (!playing) renderer.render(scene, camera);
      }, undefined, () => {
        if (cancelled) return;
        material.map = null;
        material.color.set(TILE_COLORS[index % TILE_COLORS.length]);
        material.needsUpdate = true;
      });
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
      return material;
    });
    const colorMaterials = TILE_COLORS.map((color) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true }));
    const tileMaterials = [...photoMaterials, ...colorMaterials];
    const horizontalGeometry = new THREE.PlaneGeometry(CELL_SIZE - 0.035, SEGMENT_LENGTH - 0.035);
    const verticalGeometry = new THREE.PlaneGeometry(SEGMENT_LENGTH - 0.035, CELL_SIZE - 0.035);

    const gridPoints = [];
    const addLine = (from, to) => gridPoints.push(...from, ...to);
    const nearZ = SEGMENT_LENGTH / 2;
    const farZ = -nearZ;
    for (let column = 0; column <= CELL_COUNT; column++) {
      const offset = -HALF_SIZE + column * CELL_SIZE;
      for (const side of [-1, 1]) {
        addLine([offset, side * HALF_SIZE, nearZ], [offset, side * HALF_SIZE, farZ]);
        addLine([side * HALF_SIZE, offset, nearZ], [side * HALF_SIZE, offset, farZ]);
      }
    }
    addLine([-HALF_SIZE, -HALF_SIZE, farZ], [HALF_SIZE, -HALF_SIZE, farZ]);
    addLine([-HALF_SIZE, HALF_SIZE, farZ], [HALF_SIZE, HALF_SIZE, farZ]);
    addLine([-HALF_SIZE, -HALF_SIZE, farZ], [-HALF_SIZE, HALF_SIZE, farZ]);
    addLine([HALF_SIZE, -HALF_SIZE, farZ], [HALF_SIZE, HALF_SIZE, farZ]);
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPoints, 3));
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x635c73, transparent: true, opacity: 0.3 });

    const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
      const row = new THREE.Group();
      row.position.z = -3 - rowIndex * SEGMENT_LENGTH;
      row.add(new THREE.LineSegments(gridGeometry, gridMaterial));

      for (let wall = 0; wall < 4; wall++) {
        for (let column = 0; column < CELL_COUNT; column++) {
          const chance = random();
          if (chance > 0.34) continue;
          const materialPool = chance < 0.19 ? photoMaterials : colorMaterials;
          const material = materialPool[Math.floor(random() * materialPool.length)];
          const horizontal = wall < 2;
          const tile = new THREE.Mesh(horizontal ? horizontalGeometry : verticalGeometry, material);
          const offset = -HALF_SIZE + CELL_SIZE * (column + 0.5);
          if (horizontal) {
            tile.position.set(offset, wall === 0 ? HALF_SIZE : -HALF_SIZE, 0);
            tile.rotation.x = Math.PI / 2;
          } else {
            tile.position.set(wall === 2 ? -HALF_SIZE : HALF_SIZE, offset, 0);
            tile.rotation.y = Math.PI / 2;
          }
          row.add(tile);
        }
      }
      scene.add(row);
      return row;
    });

    const streakCount = compact ? 80 : 150;
    const streakPositions = new Float32Array(streakCount * 6);
    const streakGeometry = new THREE.BufferGeometry();
    streakGeometry.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3).setUsage(THREE.DynamicDrawUsage));
    const streakMaterial = new THREE.LineBasicMaterial({ color: 0xe9e5ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const streaks = Array.from({ length: streakCount }, () => {
      const angle = random() * Math.PI * 2;
      const radius = HALF_SIZE * (0.35 + random() * 0.6);
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: -random() * depth, length: 0.8 + random() * 1.5 };
    });
    const streakMesh = new THREE.LineSegments(streakGeometry, streakMaterial);
    streakMesh.frustumCulled = false;
    scene.add(streakMesh);

    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    const flight = { speed: 7, stretch: 0.25, glow: 0, tileOpacity: 1 };
    let frameId;
    let previousTime;
    const render = (time) => {
      const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      for (const row of rows) {
        row.position.z += flight.speed * delta;
        if (row.position.z > 3) row.position.z -= depth;
      }
      streaks.forEach((streak, index) => {
        streak.z += flight.speed * delta * 1.4;
        if (streak.z > 3) streak.z -= depth;
        const offset = index * 6;
        streakPositions[offset] = streak.x;
        streakPositions[offset + 1] = streak.y;
        streakPositions[offset + 2] = streak.z;
        streakPositions[offset + 3] = streak.x;
        streakPositions[offset + 4] = streak.y;
        streakPositions[offset + 5] = streak.z - streak.length * flight.stretch;
      });
      streakGeometry.attributes.position.needsUpdate = true;
      streakMaterial.opacity = flight.glow;
      tileMaterials.forEach((material) => { material.opacity = flight.tileOpacity; });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    renderer.render(scene, camera);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true, onComplete })
        .fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
        .to(flight, { speed: 115, stretch: 5, glow: 0.7, duration: 1.65, ease: "power3.in" }, 0.2)
        .to(flight, { speed: 220, stretch: 12, glow: 0.9, tileOpacity: 0.2, duration: 0.65, ease: "power2.in" }, 1.85)
        .call(onReveal, [], 2.4)
        .to(root, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 2.4);
      playRef.current = () => {
        playing = true;
        frameId = requestAnimationFrame(render);
        timeline.play(0);
      };
    }, root);

    const onMotionChange = () => {
      if (reducedMotion.matches && playing) onComplete();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelled = true;
      playRef.current = null;
      ctx.revert();
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      horizontalGeometry.dispose();
      verticalGeometry.dispose();
      gridGeometry.dispose();
      streakGeometry.dispose();
      gridMaterial.dispose();
      streakMaterial.dispose();
      tileMaterials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReveal, onComplete]);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !playRef.current) {
      onComplete();
      return;
    }
    playRef.current();
  }, [active, onComplete]);

  return <div className="light-speed-transition" ref={rootRef} aria-hidden="true" />;
}
