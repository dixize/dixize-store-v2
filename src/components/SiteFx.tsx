"use client";

import { useEffect } from "react";

// Портированный из script.js набор «глобальных» эффектов:
// scroll progress, состояние шапки, кнопка «наверх», ripple на кнопках,
// кастомный курсор, scroll-reveal (IntersectionObserver).
export default function SiteFx() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Scroll progress + header state + back-to-top ---
    const progressBar = document.getElementById("scroll-progress-bar");
    const header = document.querySelector(".site-header");
    const backToTopBtn = document.getElementById("back-to-top");

    const onScroll = () => {
      const scrollTop = window.scrollY;
      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
      }
      if (header) header.classList.toggle("header-scrolled", scrollTop > 40);
      if (backToTopBtn) backToTopBtn.classList.toggle("visible", scrollTop > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onBackToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    backToTopBtn?.addEventListener("click", onBackToTop);

    // --- Активный пункт навигации ---
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nav-link-item[data-section]")
    );
    const sections = navLinks
      .map((link) => document.getElementById(link.dataset.section || ""))
      .filter((el): el is HTMLElement => Boolean(el));
    let sectionObserver: IntersectionObserver | null = null;
    if (sections.length && navLinks.length) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
              link.classList.toggle("active-link", link.dataset.section === entry.target.id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((section) => sectionObserver!.observe(section));
    }

    // --- Ripple-эффект (делегирование, переживает re-render) ---
    const onClickRipple = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(".action-btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement("span");
      ripple.className = "ripple-el";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };
    document.addEventListener("click", onClickRipple);

    // --- Кастомный курсор ---
    const dot = document.querySelector<HTMLElement>(".custom-cursor-dot");
    const ring = document.querySelector<HTMLElement>(".custom-cursor-ring");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let rafId = 0;
    let removeCursorListeners: (() => void) | null = null;

    if (dot && ring && canHover && !prefersReducedMotion) {
      let ringX = 0, ringY = 0, targetX = 0, targetY = 0;
      const onMouseMove = (e: MouseEvent) => {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        targetX = e.clientX;
        targetY = e.clientY;
      };
      const onMouseLeave = () => {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      };
      const animateRing = () => {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        rafId = requestAnimationFrame(animateRing);
      };
      const interactiveSelector = "a, button, .selector-tile, .addon-checkbox-label, input, textarea, select";
      const onMouseOver = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest(interactiveSelector)) ring.classList.add("cursor-active");
      };
      const onMouseOut = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest(interactiveSelector)) ring.classList.remove("cursor-active");
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseout", onMouseOut);
      rafId = requestAnimationFrame(animateRing);
      removeCursorListeners = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mouseover", onMouseOver);
        document.removeEventListener("mouseout", onMouseOut);
        cancelAnimationFrame(rafId);
      };
    }

    // --- Scroll-reveal ---
    const revealTargets = document.querySelectorAll(".scroll-reveal");
    revealTargets.forEach((target) => target.classList.add("js-prep"));
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealTargets.forEach((target) => revealObserver.observe(target));

    // --- Мобильное меню: закрытие при ресайзе ---
    const burgerToggle = document.getElementById("burger-toggle");
    const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
    const closeMobileNav = () => {
      burgerToggle?.classList.remove("active");
      mobileNavOverlay?.classList.remove("open");
      burgerToggle?.setAttribute("aria-expanded", "false");
    };
    const onResize = () => {
      if (window.innerWidth > 768) closeMobileNav();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      backToTopBtn?.removeEventListener("click", onBackToTop);
      document.removeEventListener("click", onClickRipple);
      sectionObserver?.disconnect();
      revealObserver.disconnect();
      removeCursorListeners?.();
    };
  }, []);

  return <button id="back-to-top" className="back-to-top" aria-label="Наверх" data-i18n-aria="backToTop.aria">↑</button>;
}
