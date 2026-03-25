import React, { useEffect } from 'react';
import Contact from '../sections/Contact';

const AboutMePage = () => {
    useEffect(() => {
        const svgs = document.querySelectorAll('.circular_text svg');
        let rotation = 0;
        let lastScroll = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const delta = window.scrollY - lastScroll;
                    lastScroll = window.scrollY;
                    rotation += delta * 0.15;

                    svgs.forEach((svg, i) => {
                        const direction = i % 2 === 0 ? 1 : -1;
                        svg.style.transform = `rotate(${rotation * direction}deg)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <main className="aboutPage">
            <div className="back-btn">
                <a href="/#about">&lt; back</a>
            </div>

            <section className="aboutTop">
                <div className="aboutTop_container">
                    <div className="aboutTop_top">
                        <h2 className="aboutTop_subtitle">( ABOUT ME. )</h2>
                        <h2 className="aboutTop_title">A CREATIVE FRONTEND DEVELOPER.</h2>
                        <div className="aboutTop_img">
                            <img
                                src="about_img.jpg"
                                alt="Portrait"
                                className="about_placeholder"
                                loading="lazy"
                            />
                        </div>
                        <p className="aboutTop_desc">Ryan, the future frontend developer.</p>
                    </div>

                    <div className="aboutTop_bottom">
                        <div className="aboutTop_bottom-block">
                            <h3 className="bottomBlock-h3">
                                <span>+ </span>MY ORIGIN
                            </h3>
                            <p className="bottomBlock-p aboutProse">
                                I WAS BORN AND RAISED IN ILOILO CITY, KNOWN AS THE{' '}
                                <span className="aboutEm">&quot;CITY OF LOVE&quot;</span>
                                {' '}FOR ITS RICH CULTURAL HERITAGE AND WARM HOSPITALITY. ILOILO&apos;S
                                VIBRANT ATMOSPHERE HAS DEEPLY SHAPED MY APPRECIATION FOR ART AND DESIGN.
                            </p>
                        </div>
                        <div className="aboutTop_bottom-block">
                            <h3 className="bottomBlock-h3">
                                <span>+ </span>MY CREATIVE SPARK
                            </h3>
                            <p className="bottomBlock-p aboutProse">
                                SINCE CHILDHOOD, I HAVE BEEN FASCINATED BY THE ART OF DRAWING. THIS
                                PASSION WAS AWAKENED BY CREATING DETAILED ANIME CHARACTERS AND HAS
                                EVOLVED INTO A DEEP APPRECIATION FOR CAPTURING REALISTIC PORTRAITS,
                                ALWAYS STRIVING FOR EMOTIVE EXPRESSIONS.
                            </p>
                        </div>
                        <div className="aboutTop_bottom-block">
                            <h3 className="bottomBlock-h3">
                                <span>+ </span>MY LIFESTYLE
                            </h3>
                            <p className="bottomBlock-p aboutProse">
                                MY LIFE BALANCE COMES FROM DEDICATION TO THE GYM AND THE THRILL OF
                                ADVENTURE. I FIND INSPIRATION AND ENERGY EXPLORING BEAUTIFUL PLACES,
                                AND I&apos;M DRIVEN BY DISCIPLINE AND THE DISCOVERY OF NEW LANDSCAPES
                                AND IDEAS.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="aboutMiddle">
                <div className="aboutMiddle_inner">
                    <div className="aboutMiddle_bgTitle" aria-hidden="true">
                        THE WORLD OF RHYTHM AND FLOW SHAPED MY UNDERSTANDING OF CREATIVITY — AS
                        MOVEMENT, TIMING, AND EMOTION.
                    </div>

                    <div className="aboutMiddle_grid">
                        <div className="circular_text">
                            <img
                                src="aboutMiddle.png"
                                alt=""
                                className="aboutMiddle_img"
                                loading="lazy"
                            />
                            <svg viewBox="0 0 260 260" aria-hidden="true">
                                <defs>
                                    <path
                                        id="circle-path-1"
                                        d="M130,130 m-100,0 a100,100 0 1,1 200,0
                          a100,100 0 1,1 -200,0"
                                    />
                                </defs>
                                <text fontSize="13" letterSpacing="6">
                                    <textPath href="#circle-path-1">
                                        CREATIVE * FRONTEND DEV * UI/UX DESIGNER *
                                    </textPath>
                                </text>
                            </svg>

                            <svg viewBox="0 0 260 260" aria-hidden="true">
                                <defs>
                                    <path
                                        id="circle-path-2"
                                        d="M130,130 m-100,0 a100,100 0 1,1 200,0 a100,100 0 1,1 -200,0"
                                    />
                                </defs>
                                <text fontSize="13" letterSpacing="6">
                                    <textPath href="#circle-path-2">
                                        IMAGINE * CREATE * INSPIRE * DEVELOP *
                                    </textPath>
                                </text>
                            </svg>

                            <svg viewBox="0 0 260 260" aria-hidden="true">
                                <defs>
                                    <path
                                        id="circle-path-3"
                                        d="M130,130 m-100,0 a100,100 0 1,1 200,0 a100,100 0 1,1 -200,0"
                                    />
                                </defs>
                                <text fontSize="13" letterSpacing="6">
                                    <textPath href="#circle-path-3">
                                        HTML * CSS * JAVASCRIPT * REACT *
                                    </textPath>
                                </text>
                            </svg>
                        </div>

                        <div className="aboutMiddle_wrapper">
                            <div className="aboutMiddle_buttomBlock">
                                <p className="middleBlock-P aboutProse">
                                    I AM CURRENTLY ENROLLED AS A BSIT STUDENT. THIS PATH ALLOWS ME TO
                                    COMBINE MY TECHNICAL SKILLS WITH MY CREATIVE BACKGROUND. LATER, MY
                                    FATHER INTRODUCED ME TO WEB DEVELOPMENT, AND I REALIZED IT WAS THE
                                    PERFECT SPACE WHERE TECHNOLOGY MEETS ARTISTRY.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="aboutButtom">
                <div className="years-bg">
                    <div className="year-text">2024</div>
                    <div className="year-text">2026</div>
                </div>

                <div className="content">
                    <div className="left-text">
                        <h2 className="aboutBottom_headline">
                            For me, a website is not just code on a screen.
                        </h2>
                    </div>

                    <div className="center-image">
                        <div className="photo-frame">
                            <img src="aboutButtom.png" alt="Portrait" loading="lazy" />
                        </div>
                    </div>

                    <div className="right-text">
                        <p className="aboutProse">
                            I STRIVE TO CREATE WORK THAT IS BOTH FUNCTIONAL AND VISUALLY COMPELLING,
                            BRIDGING THE GAP BETWEEN CODE AND DESIGN.
                        </p>
                    </div>
                </div>

                <div className="grain" aria-hidden="true" />
                <div className="rule-top" aria-hidden="true" />
                <div className="rule-bottom" aria-hidden="true" />
            </section>

            <Contact />
        </main>
    );
};

export default AboutMePage;
