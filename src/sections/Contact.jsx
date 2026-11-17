import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EMAIL = "ryantacaisan13@gmail.com";

const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ryan-tacaisan-b56987307/" },
  { name: "Facebook", href: "https://web.facebook.com/tacaisan.ryan" },
];

const FOOTER_LINKS = [
  { name: "About", href: "/#about" },
  { name: "Works", href: "/#works" },
  { name: "Expertise", href: "/#expertise" },
];

const HEADLINE = ["Have an idea in mind?", "Let's build it together."];
const MARQUEE_TEXT = "Creative Frontend Developer";

function ArrowIcon() {
  return (
    <svg
      className="contact-btn-arrow"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

const Contact = () => {
  const rootRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".contact-word", { opacity: 0.12, yPercent: 30 }, {
        opacity: 1,
        yPercent: 0,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".contact-headline", start: "top 85%", end: "top 45%", scrub: 0.6 },
      });
      gsap.fromTo(".contact-actions > *", { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-actions", start: "top 90%" },
      });
    });
    return () => media.revert();
  }, { scope: rootRef });

  const year = new Date().getFullYear();

  return (
    <div className="contact" ref={rootRef}>
      <div className="contact-glow" aria-hidden="true" />

      <div className="contact-inner">
        <h2 className="contact-headline" aria-label={HEADLINE.join(" ")}>
          {HEADLINE.map((line, lineIndex) => (
            <span className={`contact-line${lineIndex === 1 ? " contact-line--muted" : ""}`} aria-hidden="true" key={line}>
              {line.split(" ").map((word, i) => (
                <span className="contact-word" key={`${word}-${i}`}>{word} </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="contact-actions">
          <a className="contact-btn contact-btn--primary" href={`mailto:${EMAIL}`}>
            <span>{EMAIL}</span>
            <ArrowIcon />
          </a>
          <a
            className="contact-btn contact-btn--ghost"
            href={SOCIALS[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Connect on LinkedIn</span>
            <ArrowIcon />
          </a>
        </div>
      </div>

      <div className="contact-marquee" aria-hidden="true">
        <div className="contact-marquee-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>{MARQUEE_TEXT}<span className="contact-marquee-dot" /></span>
          ))}
        </div>
      </div>

      <footer className="contact-footer">
        <p className="contact-footer-name">Ryan Tacaisan &copy; {year}</p>
        <nav className="contact-footer-links" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.name} to={link.href}>{link.name}</Link>
          ))}
          {SOCIALS.map((link) => (
            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </nav>
        <a className="contact-top" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>
          Back to top
        </a>
      </footer>
    </div>
  );
};

export default Contact;
