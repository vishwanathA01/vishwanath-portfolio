"use client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Markdown } from "@/lib/markdown";
import { formatDate } from "@/lib/media";
import type { Page, PageKey } from "@/lib/types";
import { api, Field } from "./shared";

const META: Record<PageKey, { label: string; hint: string }> = {
  now: { label: "Now", hint: "What you’re focused on at the moment. Each ## heading also appears as a bullet in the “Right now” band on the home page." },
  about: { label: "About", hint: "The longer version of your story. Shown at /about." },
  contact: { label: "Contact", hint: "Guidance for different kinds of visitors (recruiters, collaborators, clients). Shown above the form at /contact." }
};

export default function PagesPanel({ pages, setPages, notify }: { pages: Record<PageKey, Page>; setPages: (p: Record<PageKey, Page>) => void; notify: (m: string) => void }) {
  const [key, setKey] = useState<PageKey>("now");
  const [draft, setDraft] = useState<Page>(pages.now);
  const [mode, setMode] = useState<"write" | "split" | "preview">("split");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function pick(k: PageKey) {
    setKey(k);
    setDraft(pages[k]);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api<{ page: Page }>("/api/admin/pages", "POST", { key, title: draft.title, intro: draft.intro, content: draft.content });
      setPages({ ...pages, [key]: res.page });
      setDraft(res.page);
      notify(`${META[key].label} page saved`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="editor-tabs" role="group" aria-label="Page" style={{ marginBottom: 18 }}>
        {(Object.keys(META) as PageKey[]).map(k => (
          <button key={k} type="button" aria-pressed={key === k} onClick={() => pick(k)} style={{ padding: "8px 18px" }}>/{k}</button>
        ))}
      </div>
      <form className="panel" onSubmit={save}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          <div>
            <div className="eyebrow">Page · /{key}</div>
            <p className="muted" style={{ marginTop: 6, maxWidth: 620 }}>{META[key].hint}</p>
            <p className="updated" style={{ marginTop: 8 }}>Last updated {formatDate(draft.updatedAt, { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <a className="btn btn-ghost btn-sm" href={`/${key}`} target="_blank" rel="noreferrer"><ExternalLink size={13} /> View page</a>
        </div>
        <div className="editor-grid">
          <Field label="Title"><input required value={draft.title} maxLength={80} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Intro" hint="One or two sentences under the title."><input value={draft.intro} maxLength={400} onChange={e => setDraft({ ...draft, intro: e.target.value })} /></Field>
          <div className="field full">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="field-label">Content (Markdown)</span>
              <div className="editor-tabs" role="group" aria-label="Editor mode">
                {(["write", "split", "preview"] as const).map(m => <button type="button" key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>)}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mode === "split" ? "1fr 1fr" : "1fr", gap: 14 }}>
              {mode !== "preview" && (
                <textarea value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} style={{ minHeight: 440, fontFamily: "var(--font-mono)", fontSize: 13.5 }} />
              )}
              {mode !== "write" && <div className="preview-box"><Markdown source={draft.content} /></div>}
            </div>
          </div>
        </div>
        {error && <div className="notice err" style={{ marginTop: 18 }}>{error}</div>}
        <button className="btn" style={{ marginTop: 24 }} disabled={busy}>{busy ? "Saving…" : `Save /${key}`}</button>
      </form>
    </>
  );
}
