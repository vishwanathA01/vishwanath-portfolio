"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Cover from "@/components/Cover";
import type { ProjectCard } from "@/lib/types";
import Shot from "./Shot";

/** Staggered image heights, like a printed contact sheet. */
const RATIOS = [0.94, 0.86, 0.94, 0.75, 0.8, 0.75];

export function ProjectTile({ p, index }: { p: ProjectCard; index: number }) {
  return (
    <article className="work-card" data-reveal style={{ ["--d" as string]: `${(index % 3) * 0.08}s` }}>
      <div className="work-media" style={{ aspectRatio: RATIOS[index % RATIOS.length] }}>
        {p.featured && <span className="work-badge">Featured</span>}
        {p.imageSrc ? <Shot slug={p.slug}><img src={p.imageSrc} alt={`${p.name} preview`} loading="lazy" /></Shot> : <Cover motif={p.motif} seed={p.slug} />}
      </div>
      <div className="work-cap">
        <h3><Link href={`/projects/${p.slug}`}>{p.name}</Link></h3>
        <ArrowUpRight className="arrow" size={15} aria-hidden="true" />
        <p>{p.tagline || p.description}</p>
        <span className="meta">{[p.category, p.year].filter(Boolean).join(" · ")}</span>
        {(p.link || p.github) && (
          <div className="work-links">
            {p.link && <a href={p.link} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Live</a>}
            {p.github && <a href={p.github} target="_blank" rel="noreferrer"><Github size={13} /> Code</a>}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProjectGrid({ projects, filters = true }: { projects: ProjectCard[]; filters?: boolean }) {
  const [filter, setFilter] = useState("All work");
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach(p => p.category.split("·").map(c => c.trim()).filter(Boolean).forEach(c => counts.set(c, (counts.get(c) || 0) + 1)));
    return [["All work", projects.length] as const, ...Array.from(counts.entries()).slice(0, 6)];
  }, [projects]);
  const shown = filter === "All work" ? projects : projects.filter(p => p.category.split("·").map(c => c.trim()).includes(filter));

  return (
    <>
      {filters && (
        <div className="filter-bar">
          <div className="tabs" role="group" aria-label="Filter projects">
            {categories.map(([c, n]) => (
              <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c}<sup>{String(n).padStart(2, "0")}</sup>
              </button>
            ))}
          </div>
          <span className="filter-count">{String(shown.length).padStart(2, "0")} project{shown.length === 1 ? "" : "s"}</span>
        </div>
      )}
      {shown.length === 0 ? (
        <div className="empty">No projects in this category yet.</div>
      ) : (
        <div className="work-grid">
          {shown.map((p, i) => <ProjectTile key={p.slug} p={p} index={i} />)}
        </div>
      )}
    </>
  );
}
