"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Cards that get the cursor-following spotlight. */
const SPOT = ".build-card, .field-card, .proof-card, .case, .repo, .work-card, .step, .gh-profile, .contrib, .skills-panel, .tl-card";

/**
 * Site-wide polish that needs the browser:
 * - a reading-progress bar under the header,
 * - a back-to-top button once you've scrolled,
 * - a soft spotlight that follows the cursor across cards.
 * All of it is cosmetic; the site works the same without JavaScript.
 */
export default function Enhancements() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setShowTop(window.scrollY > 700);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(SPOT) as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    if (fine) document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><div ref={bar} /></div>
      <button
        className="to-top"
        data-show={showTop}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
