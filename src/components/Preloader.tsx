"use client";

import { useEffect } from "react";

export default function Preloader() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const preloader = document.getElementById("site-preloader");
    if (!preloader) return;

    const hero = document.querySelector(".hero-section");
    const hidePreloader = () => {
      preloader.classList.add("preloader-hide");
      if (hero) hero.classList.add("revealed");
    };

    const percentEl = document.getElementById("preloader-percent-value");
    const progressFill = document.getElementById("preloader-progress-fill");

    if (percentEl && !prefersReducedMotion) {
      const duration = 1200;
      const start = performance.now();
      const tickPercent = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const value = Math.round(progress * 100);
        percentEl.textContent = String(value);
        if (progressFill) progressFill.style.width = `${value}%`;
        if (progress < 1) requestAnimationFrame(tickPercent);
      };
      requestAnimationFrame(tickPercent);
    } else if (percentEl) {
      percentEl.textContent = "100";
      if (progressFill) progressFill.style.width = "100%";
    }

    const t1 = window.setTimeout(hidePreloader, prefersReducedMotion ? 200 : 1350);
    const t2 = window.setTimeout(hidePreloader, 3000); // подстраховка
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div id="site-preloader">
      <div className="preloader-bg-grid"></div>
      <div className="preloader-glow"></div>
      <div className="preloader-inner">
        <div className="preloader-percent-big">
          <span id="preloader-percent-value">0</span>
          <span className="preloader-percent-sign">%</span>
        </div>
        <div className="preloader-progress-track">
          <div className="preloader-progress-fill" id="preloader-progress-fill"></div>
        </div>
        <div className="preloader-logo">
          dixize<span>.store</span>
        </div>
      </div>
    </div>
  );
}
