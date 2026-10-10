import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SKILLS = [
  "/UI/UX DESIGNER",
  "/WEB DESIGN",
  "/GRAPHIC DESIGN",
  "/DEVELOPER",
];

const FEATURED_TECH = [
  { name: "React", icon: "react", href: "https://react.dev/" },
  { name: "JavaScript", icon: "javascript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "Node.js", icon: "nodejs", href: "https://nodejs.org/learn" },
];

const SUPPORTING_TECH = [
  { name: "HTML", icon: "html", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS", icon: "css", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "PHP", icon: "php", href: "https://www.php.net/docs.php" },
  { name: "C++", icon: "cplusplus", href: "https://isocpp.org/" },
  { name: "Python", icon: "python", href: "https://docs.python.org/3/" },
  { name: "Java", icon: "java", href: "https://dev.java/learn/" },
  { name: "SQL", icon: "sql", href: "https://developer.mozilla.org/en-US/docs/Glossary/SQL" },
  { name: "Express.js", icon: "express", href: "https://expressjs.com/" },
  { name: "Three.js", icon: "threejs", href: "https://threejs.org/docs/" },
  { name: "MongoDB", icon: "mongodb", href: "https://www.mongodb.com/docs/" },
];

function TechnologyGrid({ technologies, featured = false }) {
  return (
    <ul
      className={`technology-grid grid-flow-dense ${featured ? "technology-grid--featured" : "technology-grid--supporting"}`}
      aria-label={featured ? "Featured technologies" : "Languages and tools"}
    >
      {technologies.map(({ name, icon, href }) => (
        <li className="technology-cell" key={name}>
          <a
            className={`technology-tile technology-tile--${icon}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} documentation (opens in a new tab)`}
          >
            <span className="technology-mark">
              <img className="technology-logo" src={`/tech/${icon}.svg`} alt="" width="128" height="128" draggable={false} />
            </span>
            <span className="technology-name">{name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Expertize() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const title = sectionRef.current.querySelector(".techstack-title");
      const glyphs = Array.from(title.querySelectorAll(".techstack-glyph[data-roll-direction]"));
      const scrollRoll = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: "top 90%",
          end: "bottom 45%",
          scrub: 0.8,
        },
      });
      const hoverRoll = gsap.timeline({
        paused: true,
        onComplete: () => hoverRoll.pause(0),
      });

      glyphs.forEach((glyph, index) => {
        const direction = Number(glyph.dataset.rollDirection);
        scrollRoll.fromTo(glyph.querySelector(".techstack-glyph-inner"), {
          yPercent: direction * 100,
        }, {
          yPercent: 0,
          duration: 1,
          ease: "power2.inOut",
        }, (index % 4) * 0.06);

        // Nested tracks keep the scroll and hover rolls independent.
        hoverRoll.fromTo(glyph.querySelector(".techstack-glyph-roll"), {
          yPercent: 0,
        }, {
          yPercent: -direction * 100,
          duration: 0.85,
          ease: "power3.inOut",
        }, index * 0.025);
      });

      const onTitleEnter = (event) => {
        if (event.pointerType === "touch" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        if (!hoverRoll.isActive()) hoverRoll.restart();
      };

      title.addEventListener("pointerenter", onTitleEnter);

      gsap.fromTo(".techstack-caption-word", { opacity: 0.1 }, {
        opacity: 1,
        stagger: 0.15,
        ease: "none",
        scrollTrigger: { trigger: ".techstack-caption", start: "top 95%", end: "top 70%", scrub: 0.5 },
      });

      gsap.fromTo(".technology-mark", { scale: 0.8 }, {
        scale: 1,
        stagger: 0.025,
        ease: "none",
        scrollTrigger: { trigger: ".techstack-grids", start: "top 90%", end: "top 50%", scrub: 0.6 },
      });

      gsap.fromTo(".techstack-grids", { opacity: 1 }, {
        opacity: 0.2,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: ".techstack-grids", start: "bottom 35%", end: "bottom 5%", scrub: 0.5 },
      });

      return () => title.removeEventListener("pointerenter", onTitleEnter);
    });

    media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const grid = sectionRef.current.querySelector(".techstack-grids");
      const highlight = grid.querySelector(".technology-highlight");
      let activeTile = null;
      let hoveredTile = null;
      let focusedTile = null;

      grid.classList.add("techstack-grids--animated");
      gsap.set(highlight, { opacity: 0, scale: 0.96 });

      const showHighlight = (tile, immediate = false) => {
        const gridBounds = grid.getBoundingClientRect();
        const tileBounds = tile.getBoundingClientRect();
        const bounds = {
          x: tileBounds.left - gridBounds.left,
          y: tileBounds.top - gridBounds.top,
          width: tileBounds.width,
          height: tileBounds.height,
        };

        // One shared rectangle glides and resizes between cells, as in the reference.
        if (!activeTile || immediate) {
          gsap.set(highlight, bounds);
        }

        gsap.to(highlight, {
          ...bounds,
          autoRound: false,
          opacity: 1,
          scale: 1,
          duration: immediate ? 0 : activeTile ? 0.55 : 0.35,
          ease: "power3.out",
          overwrite: true,
        });
        activeTile = tile;
      };

      const hideHighlight = () => {
        activeTile = null;
        gsap.to(highlight, {
          opacity: 0,
          scale: 0.96,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const onPointerOver = (event) => {
        if (event.pointerType === "touch") return;
        const tile = event.target.closest(".technology-tile");
        if (!tile || tile.contains(event.relatedTarget)) return;
        hoveredTile = tile;
        showHighlight(tile);
      };

      const onPointerLeave = () => {
        hoveredTile = null;
        if (focusedTile) showHighlight(focusedTile);
        else hideHighlight();
      };

      const onFocusIn = (event) => {
        const tile = event.target.closest(".technology-tile");
        if (!tile?.matches(":focus-visible")) return;
        focusedTile = tile;
        showHighlight(tile);
      };

      const onFocusOut = (event) => {
        focusedTile = null;
        if (grid.contains(event.relatedTarget)) return;
        if (hoveredTile) showHighlight(hoveredTile);
        else hideHighlight();
      };

      const resizeObserver = new ResizeObserver(() => {
        if (activeTile) showHighlight(activeTile, true);
      });

      grid.addEventListener("pointerover", onPointerOver);
      grid.addEventListener("pointerleave", onPointerLeave);
      grid.addEventListener("focusin", onFocusIn);
      grid.addEventListener("focusout", onFocusOut);
      resizeObserver.observe(grid);

      return () => {
        resizeObserver.disconnect();
        grid.removeEventListener("pointerover", onPointerOver);
        grid.removeEventListener("pointerleave", onPointerLeave);
        grid.removeEventListener("focusin", onFocusIn);
        grid.removeEventListener("focusout", onFocusOut);
        grid.classList.remove("techstack-grids--animated");
        gsap.killTweensOf(highlight);
      };
    });

    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <div className="expertise-section" ref={sectionRef}>
      <ul className="expertise-disciplines" aria-label="Areas of expertise">
        {SKILLS.map((label) => <li key={label}>{label}</li>)}
      </ul>

      <div className="techstack" aria-labelledby="techstack-title">
        <div className="techstack-inner">
          <h2 id="techstack-title" className="techstack-title max-w-6xl" aria-label="Modern tech stack">
            {["MODERN", "TECH STACK"].map((line) => (
              <span className="techstack-title-line" aria-hidden="true" key={line}>
                {[...line].map((character, index) => (
                  <span
                    className="techstack-glyph"
                    data-roll-direction={character === " " ? undefined : index % 2 === 0 ? 1 : -1}
                    key={`${line}-${index}`}
                  >
                    <span className="techstack-glyph-inner">
                      <span className="techstack-glyph-roll">
                        <span className="techstack-glyph-copy techstack-glyph-copy--before">
                          {character === " " ? "\u00a0" : character}
                        </span>
                        <span className="techstack-glyph-copy">
                          {character === " " ? "\u00a0" : character}
                        </span>
                        <span className="techstack-glyph-copy techstack-glyph-copy--after">
                          {character === " " ? "\u00a0" : character}
                        </span>
                      </span>
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p className="techstack-caption">
            {["TOOLS", "I", "WORK", "WITH"].map((word) => (
              <span className="techstack-caption-word" key={word}>{word} </span>
            ))}
          </p>

          <div className="techstack-grids">
            <div className="technology-highlight" aria-hidden="true" />
            <TechnologyGrid technologies={FEATURED_TECH} featured />
            <TechnologyGrid technologies={SUPPORTING_TECH} />
          </div>
        </div>
      </div>
    </div>
  );
}
