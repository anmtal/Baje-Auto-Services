/* ============================================================
   Apex Web Studio — Motion enhancement layer  (motion.dev / Framer Motion)
   Standard across all sites. ADDITIVE ONLY: scroll-reveal entrances stay
   CSS-driven (reliable everywhere); Motion adds spring hovers, scroll-linked
   zoom/parallax, and continuous floats. If this module fails to load, the
   CSS + main.js reveal system still shows and animates everything.
   Docs: https://motion.dev  |  pinned: motion@12.42.2
   ============================================================ */
import { animate, scroll, hover, press } from "https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm";

(() => {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  document.documentElement.classList.add("motion-on");
  const spring = { type: "spring", stiffness: 380, damping: 26 };
  const progressOf = (info) =>
    typeof info === "number" ? info : (info && info.y ? info.y.progress : 0);

  /* ---- 1. Tactile spring hover / press on interactive elements ---- */
  $$(".btn, .feat-card, .gal-item, .price-cat, .step, .contact-card, .hours-card, .tst-arrow, .brand")
    .forEach((el) => {
      hover(el, () => { animate(el, { scale: 1.045 }, spring); return () => animate(el, { scale: 1 }, spring); });
      press(el, () => { animate(el, { scale: 0.97 }, spring); return () => animate(el, { scale: 1.045 }, spring); });
    });

  /* ---- 2. Scroll-linked hero zoom (scroll-driven — manual transform for reliability) ---- */
  $$("[data-zoom]").forEach((el) => {
    scroll((info) => { el.style.transform = `scale(${(1 + progressOf(info) * 0.16).toFixed(4)})`; },
      { target: el, offset: ["start end", "end start"] });
  });

  /* ---- 3. Scroll-linked parallax on tagged images ---- */
  $$("[data-parallax]").forEach((el) => {
    const d = parseFloat(el.dataset.parallax) || 30;
    scroll((info) => { el.style.transform = `translateY(${((progressOf(info) - 0.5) * 2 * d).toFixed(1)}px)`; },
      { target: el, offset: ["start end", "end start"] });
  });

  /* ---- 4. Continuous gentle float on floating hero tags (always-visible motion) ---- */
  $$(".hero-tag").forEach((el, i) => {
    animate(el, { y: [0, -11, 0] }, { duration: 3.2 + i * 0.5, repeat: Infinity, ease: "easeInOut" });
  });

  /* ---- 5. Pulse the hero "live" dot (extra life on load) ---- */
  $$(".hero-badge .dot").forEach((el) => {
    animate(el, { scale: [1, 1.35, 1] }, { duration: 1.8, repeat: Infinity, ease: "easeInOut" });
  });
})();
