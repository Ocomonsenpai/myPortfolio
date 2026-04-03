import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projects } from "./data.js";
import { WORK_DESKTOP_MEDIA_QUERY } from "../constants.js";

const WRAPPER_Y = {
  BOTTOM: 0,
  MIDDLE: -80,
  TOP: -160,
};

function previewImageSrc(project, listIndex) {
  return project.previewImage ?? `/img${listIndex + 1}.png`;
}

function ProjectRow({ project, isDesktop }) {
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

  return <div className="project">{rowInner}</div>;
}

export default function Work() {
  const projectsListRef = useRef(null);
  const projectPreviewRef = useRef(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(WORK_DESKTOP_MEDIA_QUERY).matches
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia(WORK_DESKTOP_MEDIA_QUERY);
    const sync = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", sync);
    sync();
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const projectsList = projectsListRef.current;
    const projectPreview = projectPreviewRef.current;
    if (!projectsList || !projectPreview) return;

    let activeProject = null;
    let mouseTimeout = null;
    const cleanups = [];

    const resetPreviewIfOutsideList = () => {
      const bounds = projectsList.getBoundingClientRect();
      const { x, y } = lastMousePosition.current;
      if (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        return;
      }

      if (activeProject) {
        gsap.to(activeProject.querySelector(".project-wrapper"), {
          y: WRAPPER_Y.TOP,
          duration: 0.4,
          ease: "power2.out",
        });
        activeProject = null;
      }

      projectPreview.querySelectorAll("img").forEach((img) => {
        gsap.to(img, {
          scale: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => img.remove(),
        });
      });
    };

    const onDocumentMouseMove = (event) => {
      lastMousePosition.current = { x: event.clientX, y: event.clientY };

      if (mouseTimeout) clearTimeout(mouseTimeout);

      const bounds = projectsList.getBoundingClientRect();
      const { x, y } = lastMousePosition.current;
      const inside =
        x > bounds.left &&
        x < bounds.right &&
        y > bounds.top &&
        y < bounds.bottom;

      if (inside) {
        mouseTimeout = window.setTimeout(() => {
          const images = projectPreview.querySelectorAll("img");
          if (images.length <= 1) return;
          const newest = images[images.length - 1];
          images.forEach((img) => {
            if (img !== newest) {
              gsap.to(img, {
                scale: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => img.remove(),
              });
            }
          });
        }, 200);
      }

      resetPreviewIfOutsideList();
    };

    document.addEventListener("mousemove", onDocumentMouseMove);
    cleanups.push(() =>
      document.removeEventListener("mousemove", onDocumentMouseMove)
    );

    Array.from(projectsList.children).forEach((projectEl, index) => {
      const wrapper = projectEl.querySelector(".project-wrapper");
      const src = previewImageSrc(projects[index], index);

      const onEnter = () => {
        activeProject = projectEl;
        gsap.to(wrapper, {
          y: WRAPPER_Y.MIDDLE,
          duration: 0.4,
          ease: "power2.out",
        });

        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.style.position = "absolute";
        img.style.top = "0";
        img.style.left = "0";
        img.style.scale = 0;
        img.style.zIndex = String(Date.now());
        projectPreview.appendChild(img);

        gsap.to(img, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const onLeave = () => {
        activeProject = null;
        const rect = projectEl.getBoundingClientRect();
        const exitViaTop =
          lastMousePosition.current.y < rect.top + rect.height / 2;
        const targetY = exitViaTop ? WRAPPER_Y.TOP : WRAPPER_Y.BOTTOM;

        gsap.to(wrapper, {
          y: targetY,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (targetY === WRAPPER_Y.TOP) {
              gsap.set(wrapper, { y: WRAPPER_Y.BOTTOM });
            }
          },
        });
      };

      projectEl.addEventListener("mouseenter", onEnter);
      projectEl.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        projectEl.removeEventListener("mouseenter", onEnter);
        projectEl.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      if (mouseTimeout) clearTimeout(mouseTimeout);
      projectPreview.innerHTML = "";
    };
  }, [isDesktop]);

  return (
    <>
      <p className="project-p">PROJECTS AND CERTIFICATIONS</p>
      <section
        className={`projects${isDesktop ? "" : " projects--mobile"}`}
        aria-label="Projects and certifications"
      >
        <div className="projects-list" ref={projectsListRef}>
          {projects.map((project) => (
            <ProjectRow
              key={project.name}
              project={project}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </section>
      <div
        className="project-preview"
        ref={projectPreviewRef}
        aria-hidden="true"
      />
    </>
  );
}
