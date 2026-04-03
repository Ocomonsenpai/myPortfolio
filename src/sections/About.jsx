import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function applyScatter(progress, chars, scatterState) {
  chars.forEach((ch, i) => {
    const d = scatterState[i];
    const gather = 1 - progress;
    const individual = Math.max(0, Math.min(1, (gather - d.delay * 0.2) / 0.8));
    const eased = individual * individual * individual;
    const x = eased * d.tx;
    const y = eased * d.ty;
    const r = eased * d.rot;
    ch.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
    ch.style.opacity = String(1 - eased);
  });
}

const About = () => {
  const bgTextRef = useRef(null);
  const progressRef = useRef(null);
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const navigate = useNavigate();

  const lineRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const charNodes = useRef([]);
  const scatterState = useRef([]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    };

    charNodes.current = lineRefs.flatMap((ref) => {
      const el = ref.current;
      if (!el) return [];
      const text = el.textContent ?? "";
      el.innerHTML = "";
      return [...text].map((ch) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch;
        el.appendChild(span);
        return span;
      });
    });

    scatterState.current = charNodes.current.map(() => ({
      tx: (Math.random() - 0.5) * 1600,
      ty: (Math.random() - 0.5) * 1000,
      rot: (Math.random() - 0.5) * 360,
      delay: Math.random(),
    }));

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const container = containerRef.current;
      if (!container) return;

      const scrollRange = container.offsetHeight - window.innerHeight;
      const assemblyProgress = Math.max(0, Math.min(1, scrollTop / scrollRange));

      if (progressRef.current) {
        progressRef.current.style.width = `${assemblyProgress * 100}%`;
      }

      applyScatter(assemblyProgress, charNodes.current, scatterState.current);

      if (!bgTextRef.current) return;
      if (assemblyProgress < 1) {
        bgTextRef.current.style.transform = "translateY(-50%)";
      } else {
        const past = scrollTop - scrollRange;
        bgTextRef.current.style.transform = `translateY(calc(-50% + ${past * 0.3}px))`;
      }
    };

    applyScatter(0, charNodes.current, scatterState.current);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div className="progress-bar" ref={progressRef} />

      <div className="scroll-container" ref={containerRef}>
        <section className="hero" ref={heroRef}>
          <div className="bg-text" ref={bgTextRef}>
            CREATIVE
            <br />
            FRONTEND
            <br />
            DEVELOPER
          </div>

          <div className="center-col">
            <div className="photo-frame">
              <div className="photo-placeholder">
                <img
                  src="/PP2.jpg"
                  alt="A photo of Ryan Tacaisan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bio">
              <span className="bio-line" ref={lineRefs[0]}>
                HI, I'M RYAN — A CREATIVE FRONTEND DEVELOPER.
              </span>
              <span className="bio-line" ref={lineRefs[1]}>
                MY FOCUS IS ON BUILDING SLEEK, ANIMATED,
              </span>
              <span className="bio-line" ref={lineRefs[2]}>
                AND IMMERSIVE EXPERIENCES THAT TRANSFORM
              </span>
              <span className="bio-line" ref={lineRefs[3]}>
                SIMPLE WEBSITES INTO SOMETHING EXTRAORDINARY.
              </span>
            </div>
          </div>

          <span className="tag tag-tl">(ABOUT.)</span>
          <span className="tag tag-tr">[ N.002 ]</span>
          <span className="tag tag-bl">——</span>

          <button
            type="button"
            className="about-btn"
            onClick={() => navigate("/AboutMePage")}
          >
            ABOUT ME
          </button>
        </section>
      </div>
    </>
  );
};

export default About;
