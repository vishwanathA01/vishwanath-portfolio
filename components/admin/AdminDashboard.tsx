"use client";
import { useEffect, useState } from "react";
import { BookOpen, Check, Database, ExternalLink, FileText, FolderGit2, Github, Inbox, LayoutDashboard, LogOut, Mail, Plus, Settings as Cog, Trash2, X } from "lucide-react";
import Logo from "@/components/Logo";
import { ThemeButton } from "@/components/site/Header";
import { formatDate } from "@/lib/media";
import type { Contact, Highlight, Page, PageKey, Post, Project, Settings } from "@/lib/types";
import PagesPanel from "./PagesPanel";
import PostsPanel from "./PostsPanel";
import ProjectsPanel from "./ProjectsPanel";
import { api, Field } from "./shared";

type Tab = "overview" | "projects" | "blog" | "pages" | "messages" | "settings";

function SettingsPanel({ settings, setSettings, notify }: { settings: Settings; setSettings: (s: Settings) => void; notify: (m: string) => void }) {
  const [s, setS] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [test, setTest] = useState("");
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS(prev => ({ ...prev, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api<{ settings: Settings }>("/api/admin/settings", "POST", s);
      setSettings(res.settings);
      notify("Settings saved — the site is updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function testGitHub() {
    if (!s.githubUsername) return setTest("Enter a username first.");
    setTest("Checking…");
    try {
      const d = await api<{ repos: unknown[] }>(`/api/admin/github?username=${encodeURIComponent(s.githubUsername)}`);
      setTest(`✓ Found ${d.repos.length} public repositories.`);
    } catch (err) {
      setTest(err instanceof Error ? err.message : "Not found");
    }
  }

  return (
    <form className="panel" onSubmit={save}>
      <div className="eyebrow">Profile & integrations</div>
      <h2 style={{ margin: "8px 0 22px" }}>Site settings</h2>
      <div className="editor-grid">
        <div className="field full">
          <span className="field-label">GitHub username</span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label className="search" style={{ flex: "1 1 260px" }}>
              <Github size={16} className="muted" />
              <input value={s.githubUsername} onChange={e => { set("githubUsername", e.target.value.trim()); setTest(""); }} placeholder="e.g. vishwanath-thakur" aria-label="GitHub username" />
            </label>
            <button type="button" className="btn btn-ghost" onClick={testGitHub}>Test connection</button>
          </div>
          <span className="hint">{test || "Turns on the live GitHub section on the home page and pre-fills project imports."}</span>
        </div>
        <Field label="Contact email *"><input type="email" required value={s.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><input type="url" value={s.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://www.linkedin.com/in/…" /></Field>
        <Field label="X / Twitter URL"><input type="url" value={s.twitter} onChange={e => set("twitter", e.target.value)} placeholder="https://x.com/…" /></Field>
        <Field label="Booking link" hint="Calendly or Cal.com link — adds “Schedule a call” buttons across the site."><input type="url" value={s.booking} onChange={e => set("booking", e.target.value)} placeholder="https://cal.com/your-name/15min" /></Field>
        <Field label="Location"><input value={s.location} onChange={e => set("location", e.target.value)} /></Field>
        <Field label="Résumé link" hint="A URL, or /resume.pdf after adding the file to the public folder."><input value={s.resume} onChange={e => set("resume", e.target.value)} /></Field>
        <label className="check full"><input type="checkbox" checked={s.available} onChange={e => set("available", e.target.checked)} /> Show “Open to internships & collaborations” badge</label>
        <div className="field full">
          <span className="field-label">Highlight cards (shown under the hero, up to 6)</span>
          <span className="hint">Proof points like hackathon wins, certifications, internships or publications. Link is optional (a URL or a page like /projects).</span>
          <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
            {s.highlights.map((h, i) => {
              const update = (patch: Partial<Highlight>) => set("highlights", s.highlights.map((x, n) => (n === i ? { ...x, ...patch } : x)));
              return (
                <div className="hl-row" key={i}>
                  <input value={h.label} placeholder="Label" maxLength={30} onChange={e => update({ label: e.target.value })} aria-label="Label" />
                  <input value={h.title} placeholder="Title" maxLength={80} onChange={e => update({ title: e.target.value })} aria-label="Title" />
                  <input value={h.url} placeholder="Link (optional)" onChange={e => update({ url: e.target.value })} aria-label="Link" />
                  <button type="button" className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => set("highlights", s.highlights.filter((_, n) => n !== i))} aria-label="Remove highlight"><X size={14} /></button>
                </div>
              );
            })}
          </div>
          {s.highlights.length < 6 && (
            <button type="button" className="btn btn-ghost btn-sm" style={{ justifySelf: "start", marginTop: 8 }} onClick={() => set("highlights", [...s.highlights, { label: "", title: "", url: "" }])}><Plus size={13} /> Add highlight</button>
          )}
        </div>
      </div>
      {error && <div className="notice err" style={{ marginTop: 18 }}>{error}</div>}
      <button className="btn" style={{ marginTop: 24 }} disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
    </form>
  );
}

function MessagesPanel({ messages, setMessages, notify }: { messages: Contact[]; setMessages: (m: Contact[]) => void; notify: (m: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);

  async function update(m: Contact, change: { read?: boolean; remove?: boolean }) {
    if (change.remove && !confirm(`Delete the message from ${m.name}?`)) return;
    try {
      await api("/api/admin/messages", "PATCH", { id: m.id, ...change });
      setMessages(change.remove ? messages.filter(x => x.id !== m.id) : messages.map(x => (x.id === m.id ? { ...x, read: change.read !== false } : x)));
      if (change.remove) notify("Message deleted");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Update failed");
    }
  }

  if (!messages.length) return <div className="panel"><p className="muted">No messages yet. Submissions from the contact form appear here.</p></div>;

  return (
    <div className="panel" style={{ padding: 0 }}>
      {messages.map(m => (
        <div key={m.id} style={{ borderBottom: "1px solid var(--line)", padding: "16px 20px", background: m.read ? "transparent" : "var(--bg-2)" }}>
          <button
            onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.read) update(m, { read: true }); }}
            style={{ all: "unset", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto", gap: 12, width: "100%" }}
            aria-expanded={open === m.id}
          >
            <span>
              {!m.read && <span className="badge solid" style={{ marginRight: 8 }}>New</span>}
              <strong>{m.name}</strong> <span className="muted">· {m.email}</span>
              <span style={{ display: "block", marginTop: 4 }}>{m.subject}</span>
            </span>
            <span className="mono muted" style={{ fontSize: 12 }}>{formatDate(m.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
          </button>
          {open === m.id && (
            <div style={{ marginTop: 14 }}>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{m.message}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <a className="btn btn-sm" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}><Mail size={13} /> Reply</a>
                <button className="btn btn-ghost btn-sm" onClick={() => update(m, { read: !m.read })}>{m.read ? "Mark unread" : "Mark read"}</button>
                <button className="btn btn-danger btn-sm" onClick={() => update(m, { remove: true })}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({
  initialProjects,
  initialPosts,
  initialMessages,
  initialSettings,
  initialPages,
  storage,
  storageError
}: {
  initialProjects: Project[];
  initialPosts: Post[];
  initialMessages: Contact[];
  initialSettings: Settings;
  initialPages: Record<PageKey, Page>;
  storage: "mongodb" | "file";
  storageError: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [projects, setProjects] = useState(initialProjects);
  const [posts, setPosts] = useState(initialPosts);
  const [messages, setMessages] = useState(initialMessages);
  const [settings, setSettings] = useState(initialSettings);
  const [pages, setPages] = useState(initialPages);
  const [toast, setToast] = useState("");
  const [importOnOpen, setImportOnOpen] = useState(false);

  useEffect(() => {
    const fromHash = location.hash.slice(1) as Tab;
    if (["overview", "projects", "blog", "pages", "messages", "settings"].includes(fromHash)) setTab(fromHash);
  }, []);
  function go(next: Tab, withImport = false) {
    setTab(next);
    setImportOnOpen(withImport);
    history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  }
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    location.href = "/admin/login";
  }

  const unread = messages.filter(m => !m.read).length;
  const published = posts.filter(p => p.published).length;
  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
    { id: "projects", label: "Projects", icon: <FolderGit2 size={16} />, count: projects.length },
    { id: "blog", label: "Blog", icon: <BookOpen size={16} />, count: posts.length },
    { id: "pages", label: "Pages", icon: <FileText size={16} /> },
    { id: "messages", label: "Messages", icon: <Inbox size={16} />, count: unread || undefined },
    { id: "settings", label: "Settings", icon: <Cog size={16} /> }
  ];
  const titles: Record<Tab, [string, string]> = {
    overview: ["Control room", "Everything on your portfolio at a glance."],
    projects: ["Projects", "Case studies shown on the Work page. Import straight from GitHub."],
    blog: ["Blog", "Write, preview and publish articles in Markdown."],
    pages: ["Pages", "Edit your Now, About and Contact pages."],
    messages: ["Messages", "Enquiries from the contact form."],
    settings: ["Settings", "Your details, links and GitHub connection."]
  };

  return (
    <div className="admin">
      <aside className="admin-side">
        <a href="/" className="brand" target="_blank" rel="noreferrer">
          <span className="brand-mark"><Logo size={19} title="" /></span>
          <span><span className="brand-name">Admin</span><small>Portfolio CMS</small></span>
        </a>
        <div role="tablist" aria-label="Admin sections" style={{ display: "contents" }}>
          {tabs.map(t => (
            <button key={t.id} role="tab" className="admin-tab" aria-selected={tab === t.id} onClick={() => go(t.id)}>
              {t.icon} {t.label} {t.count !== undefined && <span className="count">{t.count}</span>}
            </button>
          ))}
        </div>
        <div className="spacer" style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeButton />
          <a className="icon-btn" href="/" target="_blank" rel="noreferrer" aria-label="View site"><ExternalLink size={15} /></a>
          <button className="btn btn-ghost btn-sm" onClick={logout} style={{ flex: 1 }}><LogOut size={13} /> Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-title">
          <div>
            <div className="eyebrow">Admin / {tab}</div>
            <h1>{titles[tab][0]}</h1>
            <p className="muted" style={{ marginTop: 6 }}>{titles[tab][1]}</p>
          </div>
        </div>

        {storageError && <div className="notice err" style={{ marginBottom: 18 }}>{storageError}</div>}

        {tab === "overview" && (
          <>
            <div className="stat-grid">
              <div className="stat-card"><div className="eyebrow plain">Projects</div><strong>{projects.length}</strong><span>{projects.filter(p => p.featured).length} featured on home</span></div>
              <div className="stat-card"><div className="eyebrow plain">Articles</div><strong>{posts.length}</strong><span>{published} published · {posts.length - published} drafts</span></div>
              <div className="stat-card"><div className="eyebrow plain">Inbox</div><strong>{messages.length}</strong><span>{unread} unread</span></div>
              <div className="stat-card"><div className="eyebrow plain">GitHub</div><strong style={{ fontSize: 22, marginTop: 20 }}>{settings.githubUsername ? `@${settings.githubUsername}` : "Not connected"}</strong><span>{settings.githubUsername ? "Live stats on home page" : "Add username in Settings"}</span></div>
            </div>
            <div className="panel">
              <h2>Quick actions</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                <button className="btn" onClick={() => go("projects")}><Plus size={14} /> New project</button>
                <button className="btn btn-ghost" onClick={() => go("projects", true)}><Github size={14} /> Import from GitHub</button>
                <button className="btn btn-ghost" onClick={() => go("blog")}><BookOpen size={14} /> Write an article</button>
                <button className="btn btn-ghost" onClick={() => go("pages")}><FileText size={14} /> Update /now page</button>
                {!settings.githubUsername && <button className="btn btn-ghost" onClick={() => go("settings")}><Cog size={14} /> Connect GitHub</button>}
              </div>
            </div>
            <div className="panel">
              <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}><Database size={18} /> Storage</h2>
              <p className="muted" style={{ marginTop: 8 }}>
                {storage === "mongodb"
                  ? "Content is stored in MongoDB — changes go live immediately on every deployment."
                  : "Content is stored in data/content.json (messages in data/inbox.json). Commit content.json to publish your projects and posts with the code; set MONGODB_URI to edit content on a live deployment."}
              </p>
            </div>
            {unread > 0 && (
              <div className="panel">
                <h2>Latest messages</h2>
                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  {messages.filter(m => !m.read).slice(0, 3).map(m => (
                    <button key={m.id} className="notice" style={{ cursor: "pointer", textAlign: "left" }} onClick={() => go("messages")}>
                      <Check size={14} /> <strong>{m.name}</strong> <span className="muted">— {m.subject}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {tab === "projects" && <ProjectsPanel projects={projects} setProjects={setProjects} githubUsername={settings.githubUsername} notify={setToast} startImport={importOnOpen} />}
        {tab === "blog" && <PostsPanel posts={posts} setPosts={setPosts} notify={setToast} />}
        {tab === "pages" && <PagesPanel pages={pages} setPages={setPages} notify={setToast} />}
        {tab === "messages" && <MessagesPanel messages={messages} setMessages={setMessages} notify={setToast} />}
        {tab === "settings" && <SettingsPanel settings={settings} setSettings={setSettings} notify={setToast} />}
      </main>
      {toast && <div className="toast-float" role="status">{toast}</div>}
    </div>
  );
}
