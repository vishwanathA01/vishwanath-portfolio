"use client";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Github, LayoutGrid, Rows3, Search, X } from "lucide-react";
import type { ProjectCard } from "@/lib/types";
import ProjectGrid from "./ProjectGrid";
import Shot from "./Shot";

const LIVE = ["live", "featured"];

export function CaseList({ projects }: { projects: ProjectCard[] }) {
  return (
    <div className="cases">
      {projects.map((p, i) => (
        <article className={`case${p.imageSrc ? " has-media" : ""}`} key={p.slug} data-reveal style={{ ["--d" as string]: `${Math.min(i, 3) * 0.06}s` }}>
          {p.imageSrc && (
            <Link href={`/projects/${p.slug}`} className="case-media" aria-hidden="true" tabIndex={-1}>
              <Shot slug={p.slug}><img src={p.imageSrc} alt="" loading="lazy" /></Shot>
            </Link>
          )}
          <div className="case-body">
            <div className="case-meta">
              <span className={`status-pill${LIVE.includes(p.status.toLowerCase()) ? " live" : ""}`}>{p.status}</span>
              {p.year && <span>{p.year}</span>}
              {p.category && <span>· {p.category}</span>}
              {p.role && <span>· {p.role}</span>}
            </div>
            <h3><Link href={`/projects/${p.slug}`}>{p.name}</Link></h3>
            {p.problem || p.outcome ? (
              <div className="po">
                {p.problem && <div><span className="label">Problem</span><p>{p.problem}</p></div>}
                {p.outcome && <div className="outcome"><span className="label">Outcome</span><p>{p.outcome}</p></div>}
              </div>
            ) : (
              <p className="muted">{p.description}</p>
            )}
            <div className="tags">{p.stack.slice(0, 6).map(t => <span className="tag" key={t}>{t}</span>)}</div>
            <div className="case-links">
              <Link href={`/projects/${p.slug}`}>Read the case study <ArrowRight size={14} /></Link>
              {p.link && <a href={p.link} target="_blank" rel="noreferrer">Live demo <ExternalLink size={13} /></a>}
              {p.github && <a href={p.github} target="_blank" rel="noreferrer">Source on GitHub <Github size={13} /></a>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

const cats = (p: ProjectCard) => p.category.split("·").map(c => c.trim()).filter(Boolean);

export default function ProjectsView({ projects }: { projects: ProjectCard[] }) {
  const [view, setView] = useState<"grid" | "cases">("cases");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("view");
    const q = params.get("q");
    const c = params.get("category");
    if (q) setQuery(q);
    if (c) setCategory(c);
    if (fromUrl === "cases" || fromUrl === "grid") return setView(fromUrl);
    try {
      const saved = localStorage.getItem("projects-view");
      if (saved === "cases" || saved === "grid") setView(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  function choose(v: "grid" | "cases") {
    setView(v);
    try {
      localStorage.setItem("projects-view", v);
    } catch {
      /* storage unavailable */
    }
  }

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach(p => cats(p).forEach(c => counts.set(c, (counts.get(c) || 0) + 1)));
    return [["All", projects.length] as const, ...Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6)];
  }, [projects]);

  const shown = useMemo(() => {
    const terms = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return projects.filter(p => {
      if (category !== "All" && !cats(p).includes(category)) return false;
      if (!terms.length) return true;
      const hay = [p.name, p.tagline, p.description, p.category, p.status, p.year, ...p.stack].join(" ").toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }, [projects, category, deferredQuery]);

  const filtered = category !== "All" || query.trim() !== "";
  function reset() {
    setQuery("");
    setCategory("All");
  }

  return (
    <>
      <div className="projects-toolbar">
        <label className="search" style={{ marginBottom: 0 }}>
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name or tech — React, AI, Flask…"
            aria-label="Search projects"
          />
          {query && <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
        </label>
        <div className="view-toggle" role="group" aria-label="Layout" style={{ marginBottom: 0 }}>
          <button aria-pressed={view === "cases"} onClick={() => choose("cases")}><Rows3 size={14} /> Case studies</button>
          <button aria-pressed={view === "grid"} onClick={() => choose("grid")}><LayoutGrid size={14} /> Gallery</button>
        </div>
      </div>
      <div className="filter-bar">
        <div className="tabs" role="group" aria-label="Filter by category">
          {categories.map(([c, n]) => (
            <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}<sup>{String(n).padStart(2, "0")}</sup>
            </button>
          ))}
        </div>
        <span className="filter-count" aria-live="polite">
          {String(shown.length).padStart(2, "0")} project{shown.length === 1 ? "" : "s"}
          {filtered && <button type="button" className="filter-reset" onClick={reset}>Clear</button>}
        </span>
      </div>
      {shown.length === 0 ? (
        <div className="empty">
          No projects match {query ? <>“{query}”</> : "this filter"}. <button type="button" className="filter-reset" onClick={reset}>Show all projects</button>
        </div>
      ) : view === "grid" ? (
        <ProjectGrid projects={shown} filters={false} />
      ) : (
        <CaseList projects={shown} />
      )}
    </>
  );
}
