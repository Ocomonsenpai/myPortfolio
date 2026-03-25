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
import { initCursorAnimation } from './cursor';

const HomePage = () => (
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

const App = () => {
  const [showLoader, setShowLoader] = useState(true);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const cleanup = initCursorAnimation();

    // The returned function will be called when the component unmounts.
 


    const timer = setTimeout(() => setShowLoader(false), 7000); // 7s loader
    return () => {clearTimeout(timer);
     if (typeof cleanup === 'function') cleanup(); };
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
};

export default App;