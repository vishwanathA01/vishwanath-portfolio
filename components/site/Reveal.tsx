"use client";
import { useEffect } from "react";

/**
 * Scroll-reveal for any element with [data-reveal]. Content is visible without JavaScript;
 * elements already on screen at hydration are shown immediately so nothing flashes.
 */
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.in)").forEach(el => io.observe(el));
    document.querySelectorAll("[data-reveal]").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
    });
    document.documentElement.classList.add("js");
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
