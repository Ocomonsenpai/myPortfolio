import React, { useState, useRef } from "react";
import { motion } from "motion/react";
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
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const nameRef = useRef(null);
  const rafRef = useRef(null);

  const handleScramble = () => {
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

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full ">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* NAME */}
        <Link to="/">
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
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              to={link.href}
              className="text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-500"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* MOBILE VERSION BUTTON */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
        >
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <motion.div
          className="md:hidden flex flex-col items-center py-6 space-y-6 animate-in slide-in-from-top duration-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: "100vh" }}
          transition={{ duration: 1 }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono tracking-widest text-white/70 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;