/* ============================================================
   Apex Web Studio — Motion enhancement layer  (motion.dev / Framer Motion)
   Standard across all sites. ADDITIVE + SMOOTH:
   - scroll-reveal entrances stay CSS-driven (GPU-composited, reliable)
   - Motion adds only cheap, GPU-friendly effects: ambient background
     (drifting aurora blobs + turning gears), continuous hero floats,
     a pulsing "live" dot, and spring hover/press on buttons.
   No per-scroll-frame transforms (those caused jank/flicker).
   If this module fails to load, the CSS reveal system still animates and
   the ambient shapes simply sit still — nothing breaks.
   Docs: https://motion.dev  |  pinned: motion@12.42.2
   ============================================================ */
import { animate, hover, press } from "https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm";

(() => {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  document.documentElement.classList.add("motion-on");
  const spring = { type: "spring", stiffness: 340, damping: 24, mass: 0.7 };

  /* ---- 0a. Ambient background — drifting aurora blobs ---- */
  $$(".ambient-blob").forEach((el, i) =>
    animate(el,
      { x: [0, 54, -38, 0], y: [0, -44, 28, 0], scale: [1, 1.22, 0.9, 1] },
      { duration: 13 + i * 3, repeat: Infinity, ease: "easeInOut" }));

  /* ---- 0b. Ambient background — slowly turning gears ([data-spin] = seconds/turn, negative = reverse) ---- */
  $$("[data-spin]").forEach((el) => {
    const s = parseFloat(el.dataset.spin) || 30;
    animate(el, { rotate: s < 0 ? [0, -360] : [0, 360] },
      { duration: Math.abs(s), repeat: Infinity, ease: "linear" });
  });

  /* ---- 1. Continuous gentle float on the floating hero tags ---- */
  $$(".hero-tag").forEach((el, i) =>
    animate(el, { y: [0, -10, 0] }, { duration: 3.4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }));

  /* ---- 2. Pulse the hero "live" dot ---- */
  $$(".hero-badge .dot").forEach((el) =>
    animate(el, { scale: [1, 1.3, 1] }, { duration: 1.9, repeat: Infinity, ease: "easeInOut" }));

  /* ---- 3. Spring hover / press on buttons (small elements — smooth, no reveal conflict) ---- */
  $$(".btn").forEach((el) => {
    hover(el, () => { animate(el, { scale: 1.05 }, spring); return () => animate(el, { scale: 1 }, spring); });
    press(el, () => { animate(el, { scale: 0.96 }, spring); return () => animate(el, { scale: 1.05 }, spring); });
  });
})();
