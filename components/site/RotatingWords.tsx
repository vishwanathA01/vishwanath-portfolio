"use client";
import { useEffect, useState } from "react";

/**
 * Cycles through phrases in place. Every phrase is stacked in the same grid cell, so the
 * block is always as tall/wide as the longest one and nothing around it reflows.
 * Screen readers and crawlers get the first phrase only; motion is skipped for reduced-motion users.
 */
export default function RotatingWords({ words, interval = 2800 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const start = () => { id = window.setInterval(() => setI(n => (n + 1) % words.length), interval); };
    const onVis = () => { window.clearInterval(id); if (!document.hidden) start(); };
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [words.length, interval]);

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span className="rotator" aria-hidden="true">
        {words.map((w, n) => (
          <span key={w} className="rotator-word" data-state={n === i ? "in" : n === (i - 1 + words.length) % words.length ? "out" : "idle"}>
            {w}
          </span>
        ))}
      </span>
    </>
  );
}
