export function initCursorAnimation() {
    // Create and configure the canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
    canvas.style.zIndex = '9999'; // Ensure it stays on top

    document.body.appendChild(canvas);

    // Handle window resizing
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // 1. Create trail dots array
    const trail = [];
    const COUNT = 200;
    for (let i = 0; i < COUNT; i++) trail.push({ x: 0, y: 0 });

    // 2. Track mouse position
    let mouse = { x: 0, y: 0 };

    // Initialize mouse center to prevent trail from flying in from corner
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2;

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // 3. Animate — each dot follows the one before it
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        trail[0].x += (mouse.x - trail[0].x) * 0.92;
        trail[0].y += (mouse.y - trail[0].y) * 0.92;

        for (let i = 1; i < COUNT; i++) {
            trail[i].x += (trail[i - 1].x - trail[i].x) * 0.92;
            trail[i].y += (trail[i - 1].y - trail[i].y) * 0.92;
        }

        trail.forEach((dot, i) => {
            const t = i / COUNT;
            const radius = 2 * (1 - t); // shrinks toward tail
            const alpha = 1 - t; // fades toward tail
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255,${alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}