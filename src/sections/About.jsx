import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';



const About  = () => {
    const bgTextRef = useRef(null);
    const progressRef = useRef(null);
    const heroRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const navigate = useNavigate();
    
    // Line refs for character splitting
    const lineRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const charData = useRef([]);
    const allChars = useRef([]);

    useEffect(() => {
        // 1. Cursor Movement
        const handleMouseMove = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };

        // 2. Split text into spans
        allChars.current = lineRefs.flatMap((ref) => {
            const el = ref.current;
            if (!el) return [];
            const text = el.textContent;
            el.innerHTML = '';
            return [...text].map((ch) => {
                const s = document.createElement('span');
                s.className = 'char';
                s.textContent = ch;
                el.appendChild(s);
                return s;
            });
        });

        // 3. Generate Random Scatter Data
        charData.current = allChars.current.map(() => ({
            tx: (Math.random() - 0.5) * 1600,
            ty: (Math.random() - 0.5) * 1000,
            rot: (Math.random() - 0.5) * 360,
            delay: Math.random(),
        }));

        // 4. Animation Function
        const scatterChars = (progress) => {
            allChars.current.forEach((ch, i) => {
                const d = charData.current[i];
                let gather = 1 - progress;
                const individualProg = Math.max(0, Math.min(1, (gather - d.delay * 0.2) / 0.8));
                const eased = individualProg * individualProg * individualProg;

                const x = eased * d.tx;
                const y = eased * d.ty;
                const r = eased * d.rot;

                ch.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
                ch.style.opacity = 1 - eased;
            });
        };

        // 5. Scroll Listener
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const container = containerRef.current;
            if (!container) return;

            const containerHeight = container.offsetHeight - window.innerHeight;
            const assemblyProg = Math.max(0, Math.min(1, scrollTop / containerHeight));

            // Update Progress Bar
            if (progressRef.current) {
                progressRef.current.style.width = `${assemblyProg * 100}%`;
            }

            // Animate Chars
            scatterChars(assemblyProg);

            // Conditional BG Text Parallax
            if (bgTextRef.current) {
                if (assemblyProg < 1) {
                    bgTextRef.current.style.transform = `translateY(-50%)`;
                } else {
                    const postScroll = scrollTop - containerHeight;
                    bgTextRef.current.style.transform = `translateY(calc(-50% + ${postScroll * 0.3}px))`;
                }
            }
        };

        // Init
        scatterChars(0);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleAboutClick = () => {
         navigate('/AboutMePage');
    };

    return (
        <>
            <div id="cursor" ref={cursorRef}></div>
            <div className="progress-bar" ref={progressRef}></div>

            <div className="scroll-container" ref={containerRef}>
                <section className="hero" ref={heroRef}>
                    <div className="bg-text" ref={bgTextRef}>
                        FUNDAMENTALS<br />OF WEB<br />DEVELOPMENT
                    </div>

                    <div className="center-col">
                        <div className="photo-frame">
                            <div className="photo-placeholder">
                                 <img src="/PP2.jpg" alt="A photo of Ryan Tacaisan" className="w-full h-full object-cover" />
                                 </div>
                        </div>

                        <div className="bio">
                            <span className="bio-line" ref={lineRefs[0]}>HI, I'M RYAN — A CREATIVE FRONTEND DEVELOPER.</span>
                            <span className="bio-line" ref={lineRefs[1]}>MY FOCUS IS ON BUILDING SLEEK, ANIMATED,</span>
                            <span className="bio-line" ref={lineRefs[2]}>AND IMMERSIVE EXPERIENCES THAT TRANSFORM</span>
                            <span className="bio-line" ref={lineRefs[3]}>SIMPLE WEBSITES INTO SOMETHING EXTRAORDINARY.</span>
                        </div>
                    </div>

                    <span className="tag tag-tl">(ABOUT.)</span>
                    <span className="tag tag-tr">[ N.002 ]</span>
                    <span className="tag tag-bl">——</span>

                    <button className="about-btn" onClick={handleAboutClick}>
                        ABOUT ME
                    </button>
                </section>
            </div>

          
        </>
    );
};

export default About;