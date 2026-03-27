import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import "./index.css";

const Loader = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;

    gsap.registerPlugin(CustomEase);
    CustomEase.create("counterEase", "0.9, 0, 0.1, 1");

    const ctx = gsap.context(() => {
      const textPaths = root.querySelectorAll("svg textPath");
      if (textPaths.length) {
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
          const animationDelay = (textPaths.length - 1 - index) * 0.1;
          const currentOrbitRadius = orbitRadii[index];
          const currentDuration =
            1 + (currentOrbitRadius / maxOrbitRadius) * 0.25;
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

      let loaderRotation = 0;
      const svg = root.querySelector("svg");
      if (svg) gsap.set(svg, { transformOrigin: "50% 50%" });

      function animateLoader() {
        if (cancelled || !svg) return;
        const dir = Math.random() < 0.5 ? 1 : -1;
        loaderRotation += 25 * dir;
        gsap.to(svg, {
          rotation: loaderRotation,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            if (!cancelled) animateLoader();
          },
        });
      }

      animateLoader();

      const counterText = root.querySelector(".counter p");
      const count = { value: 0 };

      if (counterText) {
        gsap.to(count, {
          value: 100,
          duration: 5,
          ease: "counterEase",
          onUpdate() {
            counterText.textContent = Math.floor(count.value).toString();
          },
        });
      }

      const orbitTextElements = root.querySelectorAll(".orbit-text");
      if (orbitTextElements.length) {
        gsap.set(orbitTextElements, { opacity: 0 });

        const orbitTextReversed = Array.from(orbitTextElements).reverse();

        gsap.to(orbitTextReversed, {
          opacity: 1,
          duration: 0.75,
          stagger: 0.125,
          ease: "power2.out",
        });

        gsap.to(orbitTextReversed, {
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          delay: 5.25,
          ease: "power2.out",
          onComplete() {
            if (cancelled) return;
            gsap.to(root, {
              opacity: 0,
              duration: 1,
            });
          },
        });
      }
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <div className="loader" ref={rootRef}>
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