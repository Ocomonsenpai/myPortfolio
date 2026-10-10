import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import "./index.css";
import { LOADER_DURATION_MS } from "./constants.js";

const Loader = ({ onHandoff, onComplete }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(CustomEase);
    CustomEase.create("counterEase", "0.9, 0, 0.1, 1");

    const ctx = gsap.context(() => {
      const duration = LOADER_DURATION_MS / 1000;
      const handoffTime = duration - 0.35;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const textPaths = root.querySelectorAll("svg textPath");
      if (textPaths.length && !reducedMotion) {
        const startTextLengths = Array.from(textPaths).map((tp) =>
          parseFloat(tp.getAttribute("textLength") || "0")
        );
        const startTextOffsets = Array.from(textPaths).map((tp) =>
          parseFloat(tp.getAttribute("startOffset") || "0")
        );

        const targetTextLengths = [4000, 3500, 3250, 3000, 2500, 2000, 1500, 1250];
        const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];
        const maxOrbitRadius = orbitRadii[0];

        textPaths.forEach((textPath, index) => {
          const animationDelay = (textPaths.length - 1 - index) * 0.035;
          const currentOrbitRadius = orbitRadii[index];
          const currentDuration =
            0.6 + (currentOrbitRadius / maxOrbitRadius) * 0.2;
          const pathLength = 2 * Math.PI * currentOrbitRadius;
          const textLengthIncrease =
            targetTextLengths[index] - startTextLengths[index];
          const offsetAdjustment =
            (textLengthIncrease / 2 / pathLength) * 100;
          const targetOffset =
            startTextOffsets[index] - offsetAdjustment;

          gsap.to(textPath, {
            attr: {
              textLength: targetTextLengths[index],
              startOffset: targetOffset + "%",
            },
            duration: currentDuration,
            ease: "power2.inOut",
            delay: animationDelay,
            yoyo: true,
            repeat: -1,
            repeatDelay: 0,
          });
        });
      }

      const svg = root.querySelector("svg");
      if (svg && !reducedMotion) {
        gsap.to(svg, {
          transformOrigin: "50% 50%",
          rotation: 25,
          duration: 0.65,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      const counterText = root.querySelector(".counter p");
      const count = { value: 0 };
      let handoffStarted = false;
      const backdropFade = gsap.to(root.querySelector(".loader-backdrop"), {
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
        paused: true,
      });
      const timeline = gsap.timeline({ onComplete });

      if (counterText) {
        timeline.to(count, {
          value: 100,
          duration: handoffTime,
          ease: "counterEase",
          onUpdate() {
            counterText.textContent = Math.floor(count.value).toString();
            if (!handoffStarted && count.value >= 50) {
              handoffStarted = true;
              if (onHandoff()) backdropFade.play();
            }
          },
        }, 0);
      }

      const orbitTextElements = root.querySelectorAll(".orbit-text");
      if (orbitTextElements.length) {
        gsap.set(orbitTextElements, { opacity: 0 });

        const orbitTextReversed = Array.from(orbitTextElements).reverse();

        timeline.to(orbitTextReversed, {
          opacity: 1,
          duration: 0.35,
          stagger: reducedMotion ? 0 : 0.045,
          ease: "power2.out",
        }, 0);

        timeline.to(orbitTextReversed, {
          opacity: 0,
          duration: 0.32,
          stagger: reducedMotion ? 0 : 0.03,
          ease: "power2.out",
        }, handoffTime - 0.2);
      }
      timeline.to(root, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, handoffTime);
    }, root);

    return () => {
      ctx.revert();
    };
  }, [onHandoff, onComplete]);

  return (
    <div className="loader" ref={rootRef}>
      <div className="loader-backdrop" aria-hidden="true" />
      <svg viewBox="-425 -425 1850 1850" xmlns="http://www.w3.org/2000/svg">
        <path id="loader-orbit-1" d="M 500, -275 a 775,775 0 1,0 0.1,0" />
        <path id="loader-orbit-2" d="M 500, -200 a 700,700 0 1,0 0.1,0" />
        <path id="loader-orbit-3" d="M 500, -125 a 625,625 0 1,0 0.1,0" />
        <path id="loader-orbit-4" d="M 500, -50 a 550,550 0 1,0 0.1,0" />
        <path id="loader-orbit-5" d="M 500, 25 a 475,475 0 1,0 0.1,0" />
        <path id="loader-orbit-6" d="M 500, 100 a 400,400 0 1,0 0.1,0" />
        <path id="loader-orbit-7" d="M 500, 175 a 325,325 0 1,0 0.1,0" />
        <path id="loader-orbit-8" d="M 500, 250 a 250,250 0 1,0 0.1,0" />

        <text className="orbit-text">
          <textPath href="#loader-orbit-1" startOffset="30%" textLength="300">
            Developer
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-2" startOffset="31%" textLength="280">
            Frontend
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-3" startOffset="33%" textLength="240">
            Creative
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-4" startOffset="32%" textLength="260">
            Designer
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-5" startOffset="30%" textLength="290">
            Portfolio
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-6" startOffset="31%" textLength="200">
            Digital
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-7" startOffset="33%" textLength="210">
            Modern
          </textPath>
        </text>
        <text className="orbit-text">
          <textPath href="#loader-orbit-8" startOffset="32%" textLength="190">
            Design
          </textPath>
        </text>
      </svg>

      <div className="counter">
        <p>0</p>
      </div>
    </div>
  );
};

export default Loader;
