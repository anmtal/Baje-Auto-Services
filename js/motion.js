/* ============================================================
   Apex Web Studio — Motion enhancement layer  (Framer-Motion / motion.dev)
   Standard across all sites. Progressive enhancement: if this module
   fails to load, the CSS + main.js reveal system still shows everything.
   Docs: https://motion.dev  |  pinned: motion@12.42.2
   ============================================================ */
import {
  animate, inView, scroll, stagger, hover, press
} from "https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm";

(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;                       // honour reduced-motion: CSS baseline shows content

  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const root = document.documentElement;
  root.classList.add("motion-on");          // lets CSS hand reveal control to Motion (see styles.css)

  const springSoft  = { type: "spring", stiffness: 220, damping: 26 };
  const springSnappy = { type: "spring", stiffness: 420, damping: 30 };

  /* ---- 1. Scroll-triggered entrances (spring) — enhances .reveal ---- */
  // Elements start hidden via CSS (.motion-on .reveal). Spring them in on view.
  $$(".reveal, .reveal-scale").forEach((el) => {
    const scaleFrom = el.classList.contains("reveal-scale");
    inView(el, () => {
      animate(el,
        scaleFrom ? { opacity: [0, 1], scale: [0.94, 1] }
                  : { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0px)"] },
        { ...springSoft, delay: revealDelay(el) });
      el.classList.add("in");               // keep in sync with the CSS/IO baseline
      return () => {};                       // animate once
    }, { amount: 0.18, margin: "0px 0px -40px 0px" });
  });
  const revealDelay = (el) =>
    el.classList.contains("d1") ? 0.07 :
    el.classList.contains("d2") ? 0.14 :
    el.classList.contains("d3") ? 0.21 :
    el.classList.contains("d4") ? 0.28 : 0;

  /* ---- 2. Staggered groups — [data-stagger] animates its children in ---- */
  $$("[data-stagger]").forEach((group) => {
    const kids = $$(":scope > *", group);
    kids.forEach((k) => (k.style.opacity = "0"));
    inView(group, () => {
      animate(kids, { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0px)"] },
        { delay: stagger(0.08), ...springSoft });
      return () => {};
    }, { amount: 0.2 });
  });

  /* ---- 3. Scroll-linked parallax — [data-parallax] (subtle depth) ---- */
  $$("[data-parallax]").forEach((el) => {
    const dist = parseFloat(el.dataset.parallax) || 40;   // px of travel across its scroll
    scroll(animate(el, { transform: [`translateY(${dist}px)`, `translateY(${-dist}px)`] },
                   { ease: "linear" }),
           { target: el, offset: ["start end", "end start"] });
  });
  // Hero image gets a gentle zoom as you scroll past it
  $$("[data-zoom]").forEach((el) => {
    scroll(animate(el, { scale: [1, 1.12] }, { ease: "linear" }),
           { target: el, offset: ["start end", "end start"] });
  });

  /* ---- 4. Tactile spring hover/press on interactive cards & buttons ---- */
  const liftTargets = ".btn, .feat-card, .gal-item, .price-cat, .step, .contact-card, .hours-card";
  $$(liftTargets).forEach((el) => {
    hover(el, () => {
      animate(el, { scale: 1.03 }, springSnappy);
      return () => animate(el, { scale: 1 }, springSnappy);
    });
    press(el, () => {
      animate(el, { scale: 0.975 }, springSnappy);
      return () => animate(el, { scale: 1.03 }, springSnappy);
    });
  });

  /* ---- 5. Failsafe: if anything is still hidden after 1.6s, show it ---- */
  setTimeout(() => {
    $$(".reveal, .reveal-scale, [data-stagger] > *").forEach((el) => {
      if (getComputedStyle(el).opacity === "0") {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.classList.add("in");
      }
    });
  }, 1600);
})();
