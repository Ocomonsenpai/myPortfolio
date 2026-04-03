const TRAIL_LENGTH = 200;
const FOLLOW_STRENGTH = 0.92;

/**
 * Full-screen cursor trail. Returns a cleanup function for React unmount.
 */
export function initCursorAnimation() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  const trail = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }));
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const onMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  document.addEventListener("mousemove", onMouseMove);

  let rafId = 0;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail[0].x += (mouse.x - trail[0].x) * FOLLOW_STRENGTH;
    trail[0].y += (mouse.y - trail[0].y) * FOLLOW_STRENGTH;

    for (let i = 1; i < TRAIL_LENGTH; i++) {
      trail[i].x += (trail[i - 1].x - trail[i].x) * FOLLOW_STRENGTH;
      trail[i].y += (trail[i - 1].y - trail[i].y) * FOLLOW_STRENGTH;
    }

    trail.forEach((dot, i) => {
      const t = i / TRAIL_LENGTH;
      const radius = 2 * (1 - t);
      const alpha = 1 - t;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("mousemove", onMouseMove);
    canvas.remove();
  };
}
