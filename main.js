/* ==========================================================================
   main.js — Pixel Canvas (nav background)
   ========================================================================== */

(function () {
  const canvas = document.getElementById('pixel-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const nav = canvas.parentElement;

  const PS   = 4;    // pixel size in px
  const GAP  = 1;    // gap between pixels
  const STEP = PS + GAP;

  let W, H, cols, rows, pixels, animId;

  /* ── Pixel object ─────────────────────────────────────────────────────── */
  function createPixel() {
    return {
      opacity:  0,
      target:   0,
      riseSpeed: 0.04 + Math.random() * 0.06,
      fallSpeed: 0.008 + Math.random() * 0.018,
      falling:  false,
      // subtle color variation: cool blue-white
      hue: 195 + Math.floor(Math.random() * 40),
    };
  }

  /* ── Setup ────────────────────────────────────────────────────────────── */
  function setup() {
    W = canvas.width  = nav.offsetWidth;
    H = canvas.height = nav.offsetHeight;
    cols = Math.ceil(W / STEP);
    rows = Math.ceil(H / STEP);
    pixels = Array.from({ length: cols * rows }, createPixel);
  }

  /* ── Draw loop ────────────────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    pixels.forEach((p, i) => {
      /* Trigger new pixel randomly */
      if (!p.falling && p.opacity < 0.005 && Math.random() < 0.00045) {
        p.target    = 0.25 + Math.random() * 0.55;
        p.falling   = false;
        p.riseSpeed = 0.04 + Math.random() * 0.07;
        p.fallSpeed = 0.006 + Math.random() * 0.016;
      }

      /* Rise phase */
      if (!p.falling) {
        p.opacity += (p.target - p.opacity) * p.riseSpeed;
        if (p.opacity >= p.target * 0.97) p.falling = true;
      }

      /* Fall phase */
      if (p.falling) {
        p.opacity *= (1 - p.fallSpeed);
        if (p.opacity < 0.004) {
          p.opacity = 0;
          p.falling = false;
          p.target  = 0;
        }
      }

      /* Draw */
      if (p.opacity > 0.004) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const a = p.opacity;
        /* Blue-white pixel glow */
        ctx.fillStyle = `hsla(${p.hue}, 60%, 85%, ${a})`;
        ctx.fillRect(c * STEP, r * STEP, PS, PS);
      }
    });

    animId = requestAnimationFrame(draw);
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  setup();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      setup();
      draw();
    }, 120);
  });
})();
