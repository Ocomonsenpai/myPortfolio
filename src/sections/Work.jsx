import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { projects } from './data.js';

const MOBILE_QUERY = '(min-width: 768px)';

const Work = () => {
    const projectsListRef = useRef(null);
    const projectPreviewRef = useRef(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : true
    );

    const POSITIONS = {
        BOTTOM: 0,
        MIDDLE: -80,
        TOP: -160,
    };

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const onChange = () => setIsDesktop(mq.matches);
        mq.addEventListener('change', onChange);
        setIsDesktop(mq.matches);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        const projectsList = projectsListRef.current;
        const projectPreview = projectPreviewRef.current;
        if (!projectsList || !projectPreview) return;

        let activeProject = null;
        let mouseTimeout = null;
        const cleanups = [];

        const animatePreview = () => {
            const projectListRect = projectsList.getBoundingClientRect();
            if (
                lastMousePosition.current.x < projectListRect.left ||
                lastMousePosition.current.x > projectListRect.right ||
                lastMousePosition.current.y < projectListRect.top ||
                lastMousePosition.current.y > projectListRect.bottom
            ) {
                if (activeProject) {
                    gsap.to(activeProject.querySelector('.project-wrapper'), {
                        y: POSITIONS.TOP,
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                    activeProject = null;
                }

                const previewImages = projectPreview.querySelectorAll('img');
                previewImages.forEach((img) => {
                    gsap.to(img, {
                        scale: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => img.remove(),
                    });
                });
            }
        };

        const handleMouseMove = (event) => {
            lastMousePosition.current = { x: event.clientX, y: event.clientY };

            if (mouseTimeout) {
                clearTimeout(mouseTimeout);
            }

            const projectsListRect = projectsList.getBoundingClientRect();
            const isInsideProjectsList =
                lastMousePosition.current.x > projectsListRect.left &&
                lastMousePosition.current.x < projectsListRect.right &&
                lastMousePosition.current.y > projectsListRect.top &&
                lastMousePosition.current.y < projectsListRect.bottom;

            if (isInsideProjectsList) {
                mouseTimeout = setTimeout(() => {
                    const images = projectPreview.querySelectorAll('img');
                    if (images.length > 1) {
                        const lastImage = images[images.length - 1];
                        images.forEach((img) => {
                            if (img !== lastImage) {
                                gsap.to(img, {
                                    scale: 0,
                                    duration: 0.4,
                                    ease: 'power2.out',
                                    onComplete: () => img.remove(),
                                });
                            }
                        });
                    }
                }, 200);
            }

            animatePreview();
        };

        document.addEventListener('mousemove', handleMouseMove);
        cleanups.push(() => document.removeEventListener('mousemove', handleMouseMove));

        const projectElements = Array.from(projectsList.children);

        projectElements.forEach((project, index) => {
            const wrapper = project.querySelector('.project-wrapper');
            let currentPosition = POSITIONS.TOP;
            const previewSrc =
                projects[index]?.previewImage ?? `/img${index + 1}.png`;

            const handleMouseEnter = () => {
                activeProject = project;
                currentPosition = POSITIONS.MIDDLE;
                gsap.to(wrapper, {
                    y: POSITIONS.MIDDLE,
                    duration: 0.4,
                    ease: 'power2.out',
                });

                const img = document.createElement('img');
                img.src = previewSrc;
                img.alt = '';
                img.style.position = 'absolute';
                img.style.top = 0;
                img.style.left = 0;
                img.style.scale = 0;
                img.style.zIndex = String(Date.now());

                projectPreview.appendChild(img);

                gsap.to(img, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            };

            const handleMouseLeave = () => {
                activeProject = null;
                const rect = project.getBoundingClientRect();
                const leavingFromTop = lastMousePosition.current.y < rect.top + rect.height / 2;

                currentPosition = leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM;
                gsap.to(wrapper, {
                    y: currentPosition,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (currentPosition === POSITIONS.TOP) {
                            gsap.set(wrapper, { y: POSITIONS.BOTTOM });
                        }
                    },
                });
            };

            project.addEventListener('mouseenter', handleMouseEnter);
            project.addEventListener('mouseleave', handleMouseLeave);
            cleanups.push(() => {
                project.removeEventListener('mouseenter', handleMouseEnter);
                project.removeEventListener('mouseleave', handleMouseLeave);
            });
        });

        return () => {
            cleanups.forEach((fn) => fn());
            if (mouseTimeout) clearTimeout(mouseTimeout);
            projectPreview.innerHTML = '';
        };
    }, [isDesktop]);

    return (
        <>
            <p className="project-p">PROJECTS AND CERTIFICATIONS</p>
            <section
                className={`projects${isDesktop ? '' : ' projects--mobile'}`}
                aria-label="Projects and certifications"
            >
                <div className="projects-list" ref={projectsListRef}>
                    {projects.map((project) => {
                        const rowInner = (
                            <div className="project-wrapper">
                                <div className="project-name">
                                    <h2 className="project-heading">{project.name}</h2>
                                    <h2 className="project-heading project-heading--meta">{project.type}</h2>
                                </div>

                                <div className="project-hover" aria-hidden={!isDesktop}>
                                    <h2 className="project-heading">{project.name}</h2>
                                    <h2 className="project-heading project-heading--meta">{project.type}</h2>
                                </div>
                                <div className="project-name project-name--duplicate">
                                    <h2 className="project-heading">{project.name}</h2>
                                    <h2 className="project-heading project-heading--meta">{project.type}</h2>
                                </div>
                            </div>
                        );

                        if (project.url) {
                            return (
                                <a
                                    key={project.name}
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project project--link"
                                    aria-label={`${project.name}: ${project.type} (opens in new tab)`}
                                >
                                    {rowInner}
                                </a>
                            );
                        }

                        return (
                            <div className="project" key={project.name}>
                                {rowInner}
                            </div>
                        );
                    })}
                </div>
            </section>
            <div className="project-preview" ref={projectPreviewRef} aria-hidden="true" />
        </>
    );
};

export default Work;
