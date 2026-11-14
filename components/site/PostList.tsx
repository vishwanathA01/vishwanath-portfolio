"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Cover, { type Tone } from "@/components/Cover";
import { formatDate } from "@/lib/media";
import type { Motif, PostCard } from "@/lib/types";

const MOTIF_CYCLE: Motif[] = ["stripes", "radial", "grid", "flow", "network", "bars"];
const TONE_CYCLE: Tone[] = ["clay", "sand", "forest", "cream"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function PostRows({ posts }: { posts: PostCard[] }) {
  return (
    <div className="post-cards">
      {posts.map((p, i) => {
        const h = hash(p.slug);
        return (
          <article className="post-card" key={p.slug} data-reveal style={{ ["--d" as string]: `${(i % 3) * 0.08}s` }}>
            <div className="work-media">
              {p.coverSrc ? <img src={p.coverSrc} alt="" loading="lazy" /> : <Cover motif={MOTIF_CYCLE[h % MOTIF_CYCLE.length]} seed={p.slug} tone={TONE_CYCLE[i % TONE_CYCLE.length]} />}
            </div>
            <div className="meta">
              <time dateTime={p.date}>{formatDate(p.date)}</time>
              <span>·</span>
              <span>{p.readingTime} min read</span>
            </div>
            <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
            {p.excerpt && <p>{p.excerpt}</p>}
            {p.tags.length > 0 && <div className="tags">{p.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>}
          </article>
        );
      })}
    </div>
  );
}

/** Compact list: title + date, excerpt, reading time. */
export function PostLines({ posts }: { posts: PostCard[] }) {
  return (
    <div className="post-lines">
      {posts.map((p, i) => (
        <article className="post-line" key={p.slug} data-reveal style={{ ["--d" as string]: `${Math.min(i, 4) * 0.05}s` }}>
          <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
          <time dateTime={p.date}>{formatDate(p.date, { month: "short", day: "numeric", year: "numeric" })}</time>
          {p.excerpt && <p>{p.excerpt}</p>}
          <span className="rt">{p.readingTime} min read{p.tags.length ? ` · ${p.tags.join(" · ")}` : ""}</span>
        </article>
      ))}
    </div>
  );
}

export default function PostList({ posts }: { posts: PostCard[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach(p => p.tags.forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [posts]);
  const shown = posts.filter(p => {
    const q = query.trim().toLowerCase();
    return (!tag || p.tags.includes(tag)) && (!q || `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  });

  return (
    <>
      <div className="filter-bar">
        <div className="tabs" role="group" aria-label="Filter by tag">
          <button aria-pressed={!tag} onClick={() => setTag("")}>All articles<sup>{String(posts.length).padStart(2, "0")}</sup></button>
          {tags.map(([t, n]) => (
            <button key={t} aria-pressed={tag === t} onClick={() => setTag(tag === t ? "" : t)}>{t}<sup>{String(n).padStart(2, "0")}</sup></button>
          ))}
        </div>
        <label className="search">
          <Search size={16} className="muted" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search articles" aria-label="Search articles" />
        </label>
      </div>
      {shown.length ? <PostLines posts={shown} /> : <div className="empty">{posts.length ? "No articles match your search." : "No articles published yet — check back soon."}</div>}
    </>
  );
}
