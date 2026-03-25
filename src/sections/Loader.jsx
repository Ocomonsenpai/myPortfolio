import React, { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
const Loader = () => {
  useEffect(() => {

// Using GSAP and CustomEase from the global CDN scripts loaded in index.html
if (window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("counterEase", "0.9, 0, 0.1, 1");
    CustomEase.create("hop", "0.175, 0.885, 0.32, 1");
}

// ── Initial hero states ──
gsap.set(".hero-bg", { scale: 1.25 });

// ── Orbit text path animations ──
const textPaths = document.querySelectorAll(".loader svg textPath");

const startTextLengths = Array.from(textPaths).map(tp => parseFloat(tp.getAttribute("textLength")));
const startTextOffsets = Array.from(textPaths).map(tp => parseFloat(tp.getAttribute("startOffset")));

const targetTextLengths = [4000, 3500, 3250, 3000, 2500, 2000, 1500, 1250];
const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];
const maxOrbitRadius = orbitRadii[0];

textPaths.forEach((textPath, index) => {
    const animationDelay = (textPaths.length - 1 - index) * 0.1;
    const currentOrbitRadius = orbitRadii[index];
    const currentDuration = 1 + (currentOrbitRadius / maxOrbitRadius) * 0.25;
    const pathLength = 2 * Math.PI * currentOrbitRadius;
    const textLengthIncrease = targetTextLengths[index] - startTextLengths[index];
    const offsetAdjustment = (textLengthIncrease / 2 / pathLength) * 100;
    const targetOffset = startTextOffsets[index] - offsetAdjustment;

    gsap.to(textPath, {
        attr: { textLength: targetTextLengths[index], startOffset: targetOffset + "%" },
        duration: currentDuration,
        ease: "power2.inOut",
        delay: animationDelay,
        yoyo: true,
        repeat: -1,
        repeatDelay: 0,
    });
});

// ── SVG spin ──
let loaderRotation = 0;

// Ensure the SVG rotates around its center
gsap.set(".loader svg", { transformOrigin: "50% 50%", svgOrigin: "500 500" });

function animateLoader() {
    const dir = Math.random() < 0.5 ? 1 : -1;
    loaderRotation += 25 * dir;
    gsap.to(".loader svg", {
        rotation: loaderRotation,
        duration: 2,
        ease: "power2.inOut",
        onComplete: animateLoader,
    });
}

animateLoader();

// ── Counter ──
const counterText = document.querySelector(".counter p");
const count = { value: 0 };

gsap.to(count, {
    value: 100,
    duration: 4,
    delay: 1,
    ease: "power2.inOut",
    onUpdate() { counterText.textContent = Math.floor(count.value); },
    onComplete() {
        gsap.to(".counter", { opacity: 0, duration: 1, delay: 0.5 });
    },
});

// ── Orbit text fade in → out → hero reveal ──
const orbitTextElements = document.querySelectorAll(".orbit-text");
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
    duration: 1,
    stagger: 0.1,
    delay: 6,
    ease: "power2.out",
    onComplete() {
        gsap.to(".loader", {
            opacity: 0,
            duration: 1,
            onComplete() {
                document.querySelector(".loader").remove();
                document.body.style.overflow = "";
            },
        });

        gsap.to(".hero-bg", { scale: 1, duration: 2, delay: 0.5, ease: "power2.out" });
        gsap.fromTo(
            ".hero-copy p",
            { y: "110%", opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, delay: 0.75, ease: "power2.out" }
        );
    },
});

    initLoaderAnimations();
  }, []);

  return (
    <div className="loader">
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

