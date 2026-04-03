import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Loader from "./loader";
import About from "./sections/About";
import Work from "./sections/Work";
import Expertize from "./sections/Expertize";
import Contact from "./sections/Contact";
import AboutMePage from "./Aboutme/AboutMePage.jsx";
import { initCursorAnimation } from "./cursor";
import { LOADER_DURATION_MS } from "./constants.js";

function HomePage() {
  return (
    <main>
      <Hero />
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
  const [showLoader, setShowLoader] = useState(true);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = hash.replace("#", "");
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: "smooth" })
      );
    }
  }, [pathname, hash]);

  useEffect(() => {
    const stopCursor = initCursorAnimation();
    const hideLoader = window.setTimeout(
      () => setShowLoader(false),
      LOADER_DURATION_MS
    );

    return () => {
      window.clearTimeout(hideLoader);
      if (typeof stopCursor === "function") stopCursor();
    };
  }, []);

  if (showLoader) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AboutMePage" element={<AboutMePage />} />
      </Routes>
    </>
  );
}

export default App;
