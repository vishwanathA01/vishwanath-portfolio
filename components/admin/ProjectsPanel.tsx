"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Github, Pencil, Plus, RefreshCw, Star, Trash2, X } from "lucide-react";
import Cover from "@/components/Cover";
import { githubPreview, slugify } from "@/lib/media";
import { MOTIFS, PROJECT_STATUSES, type Project } from "@/lib/types";
import { api, Field, FLOW_TEMPLATE, ImageField, compressImage } from "./shared";

type Repo = { name: string; description: string; url: string; homepage: string; language: string; topics: string[]; stars: number; pushed: string; created: string };
type Draft = Omit<Project, "updatedAt"> & { originalSlug?: string };

const blank = (order: number): Draft => ({
  slug: "", name: "", tagline: "", category: "", year: String(new Date().getFullYear()), status: "In progress", role: "Full-stack developer",
  description: "", problem: "", outcome: "", content: "## Overview\n\n\n## How it works\n\n\n## What I learned\n", features: [], stack: [], link: "", github: "", image: "", gallery: [],
  motif: "stripes", featured: false, order
});

const titleCase = (s: string) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());

function fromRepo(r: Repo, order: number): Draft {
  const name = titleCase(r.name);
  const desc = r.description || `${name} — a ${r.language || "software"} project.`;
  const stack = Array.from(new Set([r.language, ...r.topics.map(titleCase)].filter(Boolean))).slice(0, 8);
  return {
    ...blank(order),
    slug: slugify(r.name),
    name,
    tagline: r.description.slice(0, 200),
    description: desc.length >= 10 ? desc : `${desc} Project from GitHub.`,
    content: `## Overview\n${r.description || "Describe the problem this project solves."}\n\n## How it works\n- \n\n## Tech stack\n${stack.map(s => `- **${s}**`).join("\n")}\n\n## What I learned\n`,
    stack,
    category: [r.language, r.topics[0] && titleCase(r.topics[0])].filter(Boolean).join(" · "),
    year: (r.created || r.pushed).slice(0, 4),
    status: r.homepage ? "Live" : "In progress",
    link: r.homepage,
    github: r.url,
    image: githubPreview(r.url)
  };
}

function Thumb({ p }: { p: Project | Draft }) {
  return <div className="thumb">{p.image ? <img src={p.image} alt="" /> : <Cover motif={p.motif} seed={p.slug || "new"} />}</div>;
}

function ProjectForm({ draft: initial, onCancel, onSaved }: { draft: Draft; onCancel: () => void; onSaved: (p: Project, originalSlug?: string) => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.originalSlug));
  const [stackText, setStackText] = useState(initial.stack.join(", "));
  const [featuresText, setFeaturesText] = useState(initial.features.join("\n"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD(prev => ({ ...prev, [k]: v }));

  async function addGallery(files: FileList | null) {
    if (!files) return;
    setError("");
    try {
      const imgs: string[] = [];
      for (const f of Array.from(files).slice(0, 8 - d.gallery.length)) imgs.push(await compressImage(f));
      set("gallery", [...d.gallery, ...imgs]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...d,
        stack: stackText.split(",").map(s => s.trim()).filter(Boolean),
        features: featuresText.split("\n").map(s => s.replace(/^[-*•]\s*/, "").trim()).filter(Boolean)
      };
      const res = await api<{ project: Project }>("/api/admin/projects", "POST", payload);
      onSaved(res.project, d.originalSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel" onSubmit={save}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <div className="eyebrow">{d.originalSlug ? "Edit project" : "New project"}</div>
          <h2 style={{ marginTop: 8 }}>{d.name || "Untitled project"}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close form"><X size={16} /></button>
      </div>

      <div className="editor-grid">
        <Field label="Project name *">
          <input required value={d.name} onChange={e => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} placeholder="CareerConnect AI" />
        </Field>
        <Field label="URL slug *" hint={`Page: /projects/${d.slug || "…"}`}>
          <input required value={d.slug} onChange={e => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} placeholder="careerconnect-ai" />
        </Field>
        <Field label="Tagline" hint="One line shown on cards and at the top of the page." full>
          <input value={d.tagline} maxLength={200} onChange={e => set("tagline", e.target.value)} placeholder="An AI co-pilot for exploring careers." />
        </Field>
        <Field label="Short description *" hint="2–3 sentences. Minimum 10 characters." full>
          <textarea required minLength={10} maxLength={1000} style={{ minHeight: 90 }} value={d.description} onChange={e => set("description", e.target.value)} />
        </Field>
        <Field label="The problem" hint="Case-study view: what was wrong or missing?" full>
          <textarea maxLength={1000} style={{ minHeight: 80 }} value={d.problem} onChange={e => set("problem", e.target.value)} placeholder="Students know which job they want but not how to get there…" />
        </Field>
        <Field label="The outcome" hint="What the project achieved or makes possible. Only include results you can stand behind." full>
          <textarea maxLength={1000} style={{ minHeight: 80 }} value={d.outcome} onChange={e => set("outcome", e.target.value)} placeholder="A guided flow that turns interests into concrete role paths…" />
        </Field>
        <Field label="Category" hint="Use · to separate, e.g. AI · Full-stack">
          <input value={d.category} onChange={e => set("category", e.target.value)} placeholder="AI · Full-stack" />
        </Field>
        <Field label="My role">
          <input value={d.role} onChange={e => set("role", e.target.value)} placeholder="Full-stack developer" />
        </Field>
        <Field label="Year">
          <input value={d.year} maxLength={9} onChange={e => set("year", e.target.value)} placeholder="2026" />
        </Field>
        <Field label="Status">
          <select value={d.status} onChange={e => set("status", e.target.value)}>
            {Array.from(new Set([...PROJECT_STATUSES, d.status])).map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Tech stack" hint="Comma separated" full>
          <input value={stackText} onChange={e => setStackText(e.target.value)} placeholder="Next.js, FastAPI, MongoDB" />
        </Field>
        <Field label="Live demo URL">
          <input type="url" value={d.link} onChange={e => set("link", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="GitHub repository URL">
          <input type="url" value={d.github} onChange={e => set("github", e.target.value)} placeholder="https://github.com/you/repo" />
        </Field>

        <div className="full">
          <ImageField
            label="Cover image"
            value={d.image}
            onChange={v => set("image", v)}
            fallback={<Cover motif={d.motif} seed={d.slug || "new"} />}
            hint="Upload a screenshot, paste a URL, or leave empty to use generated cover art."
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
            {githubPreview(d.github) && d.image !== githubPreview(d.github) && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => set("image", githubPreview(d.github))}><Github size={13} /> Use GitHub preview image</button>
            )}
            {!d.image && (
              <label className="check" style={{ fontSize: 13 }}>
                Generated art style
                <select value={d.motif} onChange={e => set("motif", e.target.value as Draft["motif"])} style={{ padding: "6px 8px", border: "1px solid var(--line)", background: "var(--surface)" }}>
                  {MOTIFS.map(m => <option key={m}>{m}</option>)}
                </select>
              </label>
            )}
          </div>
        </div>

        <div className="field full">
          <span className="field-label">Gallery / screenshots ({d.gallery.length}/8)</span>
          <div className="gallery-edit">
            {d.gallery.map((g, i) => (
              <figure key={i}>
                <img src={g} alt="" />
                <button type="button" aria-label="Remove image" onClick={() => set("gallery", d.gallery.filter((_, n) => n !== i))}><X size={12} /></button>
              </figure>
            ))}
            {d.gallery.length < 8 && (
              <label className="image-preview" style={{ width: 120, cursor: "pointer" }}>
                <Plus size={18} />
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple hidden onChange={e => { addGallery(e.target.files); e.target.value = ""; }} />
              </label>
            )}
          </div>
        </div>

        <Field label="Key features" hint="One per line" full>
          <textarea style={{ minHeight: 110 }} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder={"Role exploration\nAI résumé feedback"} />
        </Field>
        <Field label="Case study (Markdown)" hint="Suggested sections: ## The constraint, ## What I built, ## What was hard, ## What I’d do differently. Add a ```flow block for an architecture diagram." full>
          <textarea style={{ minHeight: 300, fontFamily: "var(--font-mono)", fontSize: 13.5 }} value={d.content} onChange={e => set("content", e.target.value)} />
        </Field>
        <div className="full" style={{ marginTop: -8 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => set("content", d.content + FLOW_TEMPLATE)}>+ Insert flowchart template</button>
          <span className="hint" style={{ marginLeft: 12 }}>Nodes: <code>id: Title / subtitle @lane.row [input|store|accent]</code> · Arrows: <code>a -&gt; b: label</code>, <code>..&gt;</code> async, <code>~&gt;</code> data</span>
        </div>
        <div className="full" style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <label className="check"><input type="checkbox" checked={d.featured} onChange={e => set("featured", e.target.checked)} /> Feature on home page</label>
          <label className="check">Display order <input type="number" min={0} max={999} value={d.order} onChange={e => set("order", Number(e.target.value) || 0)} style={{ width: 80, padding: "6px 8px", border: "1px solid var(--line)", background: "var(--surface)" }} /></label>
        </div>
      </div>

      {error && <div className="notice err" style={{ marginTop: 18 }}>{error}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn" disabled={busy}>{busy ? "Saving…" : d.originalSlug ? "Save changes" : "Create project"}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function GitHubImport({ username: initialUser, existing, onPick, onClose }: { username: string; existing: Set<string>; onPick: (r: Repo) => void; onClose: () => void }) {
  const [username, setUsername] = useState(initialUser);
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    if (!username.trim()) return setError("Enter a GitHub username.");
    setBusy(true);
    setError("");
    try {
      const d = await api<{ repos: Repo[] }>(`/api/admin/github?username=${encodeURIComponent(username.trim())}`);
      setRepos(d.repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load repositories");
    } finally {
      setBusy(false);
    }
  }

  const shown = (repos || []).filter(r => `${r.name} ${r.description} ${r.language}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="panel" style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Import</div>
          <h2 style={{ marginTop: 8 }}>Create a project from a GitHub repository</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close import"><X size={16} /></button>
      </div>
      <p className="muted" style={{ marginTop: 6 }}>Pick a repository to pre-fill the project form with its name, description, language, topics, homepage and preview image.</p>
      <form onSubmit={load} style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <label className="search" style={{ flex: "1 1 220px" }}>
          <Github size={16} className="muted" />
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="GitHub username" aria-label="GitHub username" />
        </label>
        <button className="btn" disabled={busy}><RefreshCw size={14} /> {busy ? "Loading…" : "Load repositories"}</button>
        {repos && <label className="search" style={{ flex: "1 1 200px" }}><input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter repositories" aria-label="Filter repositories" /></label>}
      </form>
      {error && <div className="notice err" style={{ marginTop: 14 }}>{error}</div>}
      {repos && (
        repos.length === 0 ? <p className="muted" style={{ marginTop: 16 }}>No public repositories found.</p> : (
          <div className="repo-pick">
            {shown.map(r => {
              const added = existing.has(r.url.toLowerCase());
              return (
                <button key={r.url} type="button" onClick={() => onPick(r)}>
                  <strong style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>{r.name}{added && <span className="badge">Added</span>}</strong>
                  <span className="muted" style={{ fontSize: 13 }}>{r.description || "No description"}</span>
                  <span className="mono muted" style={{ fontSize: 11, display: "flex", gap: 12 }}>
                    {r.language && <span>{r.language}</span>}<span><Star size={11} /> {r.stars}</span><span>{r.pushed.slice(0, 10)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

export default function ProjectsPanel({
  projects,
  setProjects,
  githubUsername,
  notify,
  startImport
}: {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  githubUsername: string;
  notify: (m: string) => void;
  startImport?: boolean;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [importing, setImporting] = useState(Boolean(startImport));
  const existing = useMemo(() => new Set(projects.map(p => p.github.toLowerCase()).filter(Boolean)), [projects]);
  const nextOrder = projects.reduce((m, p) => Math.max(m, p.order), 0) + 1;

  async function remove(p: Project) {
    if (!confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/projects?slug=${encodeURIComponent(p.slug)}`, "DELETE");
      setProjects(projects.filter(x => x.slug !== p.slug));
      notify("Project deleted");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function move(p: Project, dir: -1 | 1) {
    const sorted = [...projects];
    const i = sorted.findIndex(x => x.slug === p.slug);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    const reordered = sorted.map((x, n) => ({ ...x, order: n + 1 }));
    setProjects(reordered);
    try {
      for (const x of [reordered[i], reordered[j]]) await api("/api/admin/projects", "POST", { ...x, originalSlug: x.slug });
    } catch (e) {
      notify(e instanceof Error ? e.message : "Reorder failed");
    }
  }

  function saved(p: Project, originalSlug?: string) {
    const rest = projects.filter(x => x.slug !== (originalSlug || p.slug));
    setProjects([...rest, p].sort((a, b) => a.order - b.order));
    setDraft(null);
    notify(originalSlug ? "Project updated" : "Project created");
  }

  if (draft) return <ProjectForm key={draft.originalSlug || draft.slug || "new"} draft={draft} onCancel={() => setDraft(null)} onSaved={saved} />;

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <button className="btn" onClick={() => setDraft(blank(nextOrder))}><Plus size={14} /> New project</button>
        <button className="btn btn-ghost" onClick={() => setImporting(true)}><Github size={14} /> Import from GitHub</button>
      </div>
      {importing && (
        <GitHubImport
          username={githubUsername}
          existing={existing}
          onClose={() => setImporting(false)}
          onPick={r => { setImporting(false); setDraft(fromRepo(r, nextOrder)); }}
        />
      )}
      <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
        {projects.length === 0 ? (
          <p className="muted" style={{ padding: 24 }}>No projects yet — create one or import from GitHub.</p>
        ) : (
          <table className="table">
            <thead><tr><th>Project</th><th>Status</th><th>Links</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.slug}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Thumb p={p} />
                      <div>
                        <strong>{p.name}</strong> {p.featured && <span className="badge solid">Featured</span>}
                        <div className="muted" style={{ fontSize: 13 }}>{p.category || "—"} · {p.year}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge">{p.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.link && <a className="icon-btn" style={{ width: 30, height: 30 }} href={p.link} target="_blank" rel="noreferrer" aria-label="Live demo"><ExternalLink size={13} /></a>}
                      {p.github && <a className="icon-btn" style={{ width: 30, height: 30 }} href={p.github} target="_blank" rel="noreferrer" aria-label="Repository"><Github size={13} /></a>}
                      {!p.link && !p.github && <span className="muted">—</span>}
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => move(p, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={13} /></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => move(p, 1)} disabled={i === projects.length - 1} aria-label="Move down"><ArrowDown size={13} /></button>
                      <a className="icon-btn" style={{ width: 32, height: 32 }} href={`/projects/${p.slug}`} target="_blank" rel="noreferrer" aria-label="View page"><ExternalLink size={13} /></a>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDraft({ ...p, originalSlug: p.slug })}><Pencil size={12} /> Edit</button>
                      <button className="icon-btn" style={{ width: 32, height: 32, color: "#c0392b" }} onClick={() => remove(p)} aria-label={`Delete ${p.name}`}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
