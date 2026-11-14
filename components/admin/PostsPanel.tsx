"use client";
import { useRef, useState } from "react";
import { Bold, Code, ExternalLink, Heading2, Image as ImageIcon, Italic, Link2, List, Pencil, Plus, Quote, Trash2, Workflow, X } from "lucide-react";
import { Markdown } from "@/lib/markdown";
import { formatDate, readingTime, slugify } from "@/lib/media";
import type { Post } from "@/lib/types";
import { api, Field, FLOW_TEMPLATE, ImageField } from "./shared";

type Draft = Omit<Post, "updatedAt"> & { originalSlug?: string };

const today = () => new Date().toISOString().slice(0, 10);
const blank = (): Draft => ({ slug: "", title: "", excerpt: "", content: "", tags: [], cover: "", published: false, date: today() });

function PostEditor({ initial, onCancel, onSaved }: { initial: Draft; onCancel: () => void; onSaved: (p: Post, originalSlug?: string) => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [tagsText, setTagsText] = useState(initial.tags.join(", "));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.originalSlug));
  const [mode, setMode] = useState<"write" | "split" | "preview">("split");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD(prev => ({ ...prev, [k]: v }));

  function wrap(before: string, after = "", placeholder = "text", linePrefix = false) {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    if (linePrefix) {
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const next = value.slice(0, lineStart) + before + value.slice(lineStart);
      set("content", next);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, e + before.length); });
      return;
    }
    const insert = before + selected + after;
    const next = value.slice(0, s) + insert + value.slice(e);
    set("content", next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + selected.length); });
  }

  async function save(publish?: boolean) {
    setBusy(true);
    setError("");
    try {
      const payload = { ...d, published: publish ?? d.published, tags: tagsText.split(",").map(t => t.trim().replace(/^#/, "")).filter(Boolean) };
      const res = await api<{ post: Post }>("/api/admin/posts", "POST", payload);
      onSaved(res.post, d.originalSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const tools = [
    { icon: <Heading2 size={14} />, label: "Heading", run: () => wrap("## ", "", "", true) },
    { icon: <Bold size={14} />, label: "Bold", run: () => wrap("**", "**", "bold text") },
    { icon: <Italic size={14} />, label: "Italic", run: () => wrap("*", "*", "italic text") },
    { icon: <Code size={14} />, label: "Code", run: () => wrap("`", "`", "code") },
    { icon: <Link2 size={14} />, label: "Link", run: () => wrap("[", "](https://)", "link text") },
    { icon: <List size={14} />, label: "List", run: () => wrap("- ", "", "", true) },
    { icon: <Quote size={14} />, label: "Quote", run: () => wrap("> ", "", "", true) },
    { icon: <ImageIcon size={14} />, label: "Image", run: () => wrap("![", "](https://image-url)", "caption") },
    { icon: <Workflow size={14} />, label: "Flowchart", run: () => wrap(FLOW_TEMPLATE, "", "") }
  ];

  return (
    <form className="panel" onSubmit={e => { e.preventDefault(); save(); }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <div className="eyebrow">{d.originalSlug ? "Edit article" : "New article"}</div>
          <h2 style={{ marginTop: 8 }}>{d.title || "Untitled article"}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close editor"><X size={16} /></button>
      </div>
      <div className="editor-grid">
        <Field label="Title *" full>
          <input required minLength={3} value={d.title} onChange={e => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} placeholder="What I learned building…" style={{ fontSize: 20 }} />
        </Field>
        <Field label="URL slug *" hint={`/blog/${d.slug || "…"}`}>
          <input required value={d.slug} onChange={e => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
        </Field>
        <Field label="Publish date">
          <input type="date" required value={d.date} onChange={e => set("date", e.target.value)} />
        </Field>
        <Field label="Excerpt" hint="Shown in lists and search results." full>
          <textarea maxLength={400} style={{ minHeight: 70 }} value={d.excerpt} onChange={e => set("excerpt", e.target.value)} />
        </Field>
        <Field label="Tags" hint="Comma separated, e.g. Next.js, Design" full>
          <input value={tagsText} onChange={e => setTagsText(e.target.value)} />
        </Field>
        <div className="full"><ImageField label="Cover image (optional)" value={d.cover} onChange={v => set("cover", v)} /></div>

        <div className="field full">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="field-label">Content (Markdown) · {readingTime(d.content)} min read</span>
            <div className="editor-tabs" role="group" aria-label="Editor mode">
              {(["write", "split", "preview"] as const).map(m => <button type="button" key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>)}
            </div>
          </div>
          {mode !== "preview" && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {tools.map(t => <button type="button" key={t.label} className="icon-btn" style={{ width: 34, height: 34 }} onClick={t.run} title={t.label} aria-label={t.label}>{t.icon}</button>)}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: mode === "split" ? "1fr 1fr" : "1fr", gap: 14 }}>
            {mode !== "preview" && (
              <textarea
                ref={ta}
                required
                value={d.content}
                onChange={e => set("content", e.target.value)}
                style={{ minHeight: 460, fontFamily: "var(--font-mono)", fontSize: 13.5 }}
                placeholder={"## Introduction\n\nStart writing…"}
              />
            )}
            {mode !== "write" && (
              <div className="preview-box">
                {d.content.trim() ? <Markdown source={d.content} /> : <p className="muted">Preview appears here.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      {error && <div className="notice err" style={{ marginTop: 18 }}>{error}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="btn" disabled={busy} onClick={() => save(true)}>{busy ? "Saving…" : d.published ? "Update & keep published" : "Publish"}</button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => save(false)}>{d.published ? "Unpublish (save as draft)" : "Save draft"}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function PostsPanel({ posts, setPosts, notify }: { posts: Post[]; setPosts: (p: Post[]) => void; notify: (m: string) => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);

  function saved(p: Post, originalSlug?: string) {
    const rest = posts.filter(x => x.slug !== (originalSlug || p.slug));
    setPosts([...rest, p].sort((a, b) => b.date.localeCompare(a.date)));
    setDraft(null);
    notify(p.published ? "Article published" : "Draft saved");
  }

  async function remove(p: Post) {
    if (!confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/posts?slug=${encodeURIComponent(p.slug)}`, "DELETE");
      setPosts(posts.filter(x => x.slug !== p.slug));
      notify("Article deleted");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (draft) return <PostEditor key={draft.originalSlug || "new"} initial={draft} onCancel={() => setDraft(null)} onSaved={saved} />;

  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button className="btn" onClick={() => setDraft(blank())}><Plus size={14} /> New article</button>
      </div>
      <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
        {posts.length === 0 ? (
          <p className="muted" style={{ padding: 24 }}>No articles yet. Write your first one!</p>
        ) : (
          <table className="table">
            <thead><tr><th>Article</th><th>Status</th><th>Date</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.slug}>
                  <td>
                    <strong>{p.title}</strong>
                    <div className="muted" style={{ fontSize: 13 }}>{p.tags.map(t => `#${t}`).join(" ") || "No tags"} · {readingTime(p.content)} min</div>
                  </td>
                  <td><span className={`badge${p.published ? " solid" : ""}`}>{p.published ? "Published" : "Draft"}</span></td>
                  <td className="mono" style={{ fontSize: 12 }}>{formatDate(p.date)}</td>
                  <td>
                    <div className="row-actions">
                      {p.published && <a className="icon-btn" style={{ width: 32, height: 32 }} href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" aria-label="View article"><ExternalLink size={13} /></a>}
                      <button className="btn btn-ghost btn-sm" onClick={() => setDraft({ ...p, originalSlug: p.slug })}><Pencil size={12} /> Edit</button>
                      <button className="icon-btn" style={{ width: 32, height: 32, color: "#c0392b" }} onClick={() => remove(p)} aria-label={`Delete ${p.title}`}><Trash2 size={13} /></button>
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
