"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, Copy, FolderGit2, Github, Hash, Linkedin, Mail, Moon, Search } from "lucide-react";
import { toggleTheme } from "@/lib/theme";

type Item = { group: string; label: string; hint?: string; icon: React.ReactNode; run: () => void; keywords?: string };

export default function CommandPalette({
  projects,
  posts,
  email,
  github,
  linkedin
}: {
  projects: { slug: string; name: string; category: string }[];
  posts: { slug: string; title: string }[];
  email: string;
  github: string;
  linkedin: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "/" && !open && !(e.target as HTMLElement)?.closest("input,textarea,[contenteditable]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const list: Item[] = [
      { group: "Navigate", label: "Home", icon: <Hash size={15} />, run: go("/") },
      { group: "Navigate", label: "All projects", icon: <FolderGit2 size={15} />, run: go("/projects") },
      { group: "Navigate", label: "About — the longer version", icon: <Hash size={15} />, run: go("/about") },
      { group: "Navigate", label: "Now — what I’m focused on", icon: <Hash size={15} />, run: go("/now") },
      { group: "Navigate", label: "Skills", icon: <Hash size={15} />, run: go("/#skills") },
      { group: "Navigate", label: "Journey", icon: <Hash size={15} />, run: go("/#journey") },
      { group: "Navigate", label: "Blog", icon: <BookOpen size={15} />, run: go("/blog") },
      { group: "Navigate", label: "Contact", icon: <Mail size={15} />, run: go("/contact") },
      { group: "Navigate", label: "Subscribe via RSS", icon: <BookOpen size={15} />, run: go("/rss"), keywords: "subscribe rss feed reader" },
      ...projects.map(p => ({ group: "Projects", label: p.name, hint: p.category, icon: <FolderGit2 size={15} />, run: go(`/projects/${p.slug}`) })),
      ...posts.map(p => ({ group: "Writing", label: p.title, icon: <BookOpen size={15} />, run: go(`/blog/${p.slug}`) })),
      { group: "Actions", label: "Toggle light / dark theme", icon: <Moon size={15} />, run: toggleTheme, keywords: "dark mode light" },
      {
        group: "Actions",
        label: "Copy email address",
        hint: email,
        icon: <Copy size={15} />,
        run: () => navigator.clipboard?.writeText(email).then(() => setToast("Email copied"), () => setToast(email))
      }
    ];
    if (github) list.push({ group: "Actions", label: "Open GitHub profile", icon: <Github size={15} />, run: () => window.open(github, "_blank", "noopener") });
    if (linkedin) list.push({ group: "Actions", label: "Open LinkedIn", icon: <Linkedin size={15} />, run: () => window.open(linkedin, "_blank", "noopener") });
    return list;
  }, [projects, posts, email, github, linkedin, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => `${i.label} ${i.hint || ""} ${i.group} ${i.keywords || ""}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function choose(item?: Item) {
    if (!item) return;
    setOpen(false);
    item.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(filtered[active]); }
    else if (e.key === "Escape") setOpen(false);
  }

  let lastGroup = "";
  return (
    <>
      {open && (
        <div className="palette-backdrop" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="palette" role="dialog" aria-modal="true" aria-label="Quick navigation">
            <div className="palette-input">
              <Search size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages, projects, posts…"
                aria-label="Search"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={`pi-${active}`}
              />
              <kbd>ESC</kbd>
            </div>
            <div className="palette-list" id="palette-list" role="listbox" ref={listRef}>
              {filtered.length === 0 && <p className="muted" style={{ padding: 18 }}>No results for “{query}”.</p>}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup ? <div className="palette-group">{item.group}</div> : null;
                lastGroup = item.group;
                return (
                  <div key={`${item.group}-${item.label}`}>
                    {header}
                    <button
                      id={`pi-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className="palette-item"
                      data-active={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => choose(item)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.hint ? <small>{item.hint}</small> : <small><ArrowRight size={13} /></small>}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="palette-foot">
              <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> open</span>
              <span><kbd>/</kbd> or <kbd>⌘K</kbd> anywhere</span>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="toast-float" role="status">{toast}</div>}
    </>
  );
}
