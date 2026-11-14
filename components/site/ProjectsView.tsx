"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Github, LayoutGrid, Rows3 } from "lucide-react";
import Cover from "@/components/Cover";
import type { ProjectCard } from "@/lib/types";
import ProjectGrid from "./ProjectGrid";

const LIVE = ["live", "featured"];

export function CaseList({ projects }: { projects: ProjectCard[] }) {
  return (
    <div className="cases">
      {projects.map((p, i) => (
        <article className="case" key={p.slug} data-reveal style={{ ["--d" as string]: `${Math.min(i, 3) * 0.06}s` }}>
          <div className="case-media">
            {p.imageSrc ? <img src={p.imageSrc} alt="" loading="lazy" /> : <Cover motif={p.motif} seed={p.slug} />}
          </div>
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

export default function ProjectsView({ projects }: { projects: ProjectCard[] }) {
  const [view, setView] = useState<"grid" | "cases">("cases");
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("view");
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
  return (
    <>
      <div className="view-toggle" role="group" aria-label="Layout">
        <button aria-pressed={view === "cases"} onClick={() => choose("cases")}><Rows3 size={14} /> Case studies</button>
        <button aria-pressed={view === "grid"} onClick={() => choose("grid")}><LayoutGrid size={14} /> Gallery</button>
      </div>
      {view === "grid" ? <ProjectGrid projects={projects} /> : <CaseList projects={projects} />}
    </>
  );
}
