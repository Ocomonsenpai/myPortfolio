const SKILLS = [
  "/UI/UX DESIGNER",
  "/WEB DESIGN",
  "/GRAPHIC DESIGN",
  "/DEVELOPER",
];

const TECH = [
  "HTML",
  "CSS",
  "JAVASCRIPT",
  "PHP",
  "C++",
  "PHYTON",
  "JAVA",
  "SQL",
  "NODE.JS",
  "react.js",
  "EXPRESS.JS",
  "THREE.JS",
  "MONGODB",
];

export default function Expertize() {
  return (
    <>
      <div className="main">
        {SKILLS.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>

      <div className="tecnologies">
        {TECH.map((name) => (
          <p key={name}>{name}</p>
        ))}
      </div>
    </>
  );
}
