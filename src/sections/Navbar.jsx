import React, { useEffect, useState, useRef } from "react";
import { motion as Motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
const NAV_LINKS = [
  { name: 'ABOUT', href: '/#about' },
  { name: 'EXPERTISE', href: '/#expertise' },
  { name: 'WORKS', href: '/#works' },
  { name: 'CONTACT', href: '/#contact' }
];

const Navbar = () => {
  const [nameText, setNameText] = useState('RYAN TACAISAN');
  const [isOpen, setIsOpen] = useState(false);
  const nameRef = useRef(null);
  const rafRef = useRef(null);
  const menuButtonRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setIsOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      desktopQuery.removeEventListener("change", closeOnDesktop);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const handleScramble = () => {
    if (reduceMotion) return;
    const original = 'RYAN TACAISAN';
    let frame = 0;
    const totalFrames = original.length * 3;

    const update = () => {
      const resolved = Math.floor((frame / totalFrames) * original.length);
      let result = original.split('').map((char, i) => {
        if (char === ' ') return ' ';
        return i < resolved ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setNameText(result);
      frame++;
      if (frame <= totalFrames) rafRef.current = requestAnimationFrame(update);
      else setNameText(original);
    };

    cancelAnimationFrame(rafRef.current);
    update();
  };

  const handleGlow = (e) => {
    if (!nameRef.current) return;
    const rect = nameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    nameRef.current.style.setProperty('--x', `${x}%`);
    nameRef.current.style.setProperty('--y', `${y}%`);
  };

  const handleNavClick = (link) => {
    setIsOpen(false);
    if (link.href !== `${window.location.pathname}${window.location.hash}`) return;

    requestAnimationFrame(() => {
      document.getElementById(link.href.split("#")[1])?.scrollIntoView({
        behavior: reduceMotion ? "instant" : "smooth",
      });
    });
  };

  return (
    <nav className="site-navbar" aria-label="Primary navigation">
      <div className="navbar-inner">
        
        {/* NAME */}
        <Link
          to="/"
          className="navbar-brand"
          aria-label="Ryan Tacaisan home"
          onClick={() => setIsOpen(false)}
        >
          <div 
            ref={nameRef}
            onMouseEnter={handleScramble}
            onMouseMove={handleGlow}
            className="cursor-pointer font-black tracking-tighter transition-all duration-300 bg-clip-text text-transparent"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.5rem",
              backgroundImage: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), #fff 0%, #e8dcc8 50%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            {nameText}
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              to={link.href}
              onClick={() => handleNavClick(link)}
              className="nav-link"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* MOBILE VERSION BUTTON */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="navbar-toggle"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <Motion.div
        id="mobile-navigation"
        className="navbar-mobile-menu"
        hidden={!isOpen}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -8 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={() => handleNavClick(link)}
            className="nav-link"
          >
            {link.name}
          </Link>
        ))}
      </Motion.div>
    </nav>
  );
};

export default Navbar;
