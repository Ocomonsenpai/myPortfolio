import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import LightSpeedTransition from "./sections/LightSpeedTransition";
import Loader from "./loader";
import About from "./sections/About";
import Work from "./sections/Work";
import Expertize from "./sections/Expertize";
import Contact from "./sections/Contact";
import AboutMePage from "./Aboutme/AboutMePage.jsx";
import { initCursorAnimation } from "./cursor";

function HomePage({ introReady }) {
  return (
    <main>
      <Hero introReady={introReady} />
      <section id="about">
        <About />
      </section>
      <section id="works">
        <Work />
      </section>
      <section id="expertise">
        <Expertize />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}

function App() {
  const [introPhase, setIntroPhase] = useState("loader");
  const { pathname, hash } = useLocation();
  const previousPathRef = useRef(pathname);
  const introActive = introPhase !== "ready";
  const showFlight = introPhase === "handoff" || introPhase === "flight" || introPhase === "reveal";
  const showLoader = introPhase === "loader" || introPhase === "handoff";
  const beginFlight = useCallback(() => {
    if (pathname === "/" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroPhase("handoff");
      return true;
    }
    return false;
  }, [pathname]);
  const finishLoader = useCallback(() => {
    setIntroPhase((phase) => phase === "handoff" ? "flight" : "ready");
  }, []);
  const revealHero = useCallback(() => setIntroPhase("reveal"), []);
  const finishIntro = useCallback(() => setIntroPhase("ready"), []);

  useEffect(() => {
    if (introPhase !== "ready") {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.replace("#", "");
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      // Coming from another page: jump straight there instead of sliding past the whole home page.
      const cameFromOtherPage = previousPathRef.current !== pathname;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: cameFromOtherPage || reduceMotion ? "instant" : "smooth" })
      );
    }
  }, [pathname, hash, introPhase]);

  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const stopCursor = initCursorAnimation();
    return () => {
      if (typeof stopCursor === "function") stopCursor();
    };
  }, []);

  useEffect(() => {
    if (!introActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [introActive]);

  return (
    <>
      <div className="site-shell" data-intro-phase={introPhase} inert={introActive} aria-busy={introActive}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage introReady={introPhase === "reveal" || introPhase === "ready"} />} />
          <Route path="/AboutMePage" element={<AboutMePage />} />
        </Routes>
      </div>
      {pathname === "/" && introActive && <LightSpeedTransition active={showFlight} onReveal={revealHero} onComplete={finishIntro} />}
      {showLoader && <Loader onHandoff={beginFlight} onComplete={finishLoader} />}
    </>
  );
}

export default App;
