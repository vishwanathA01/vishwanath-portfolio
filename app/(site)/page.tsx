import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, Rss } from "lucide-react";
import Logo from "@/components/Logo";
import BookingButton from "@/components/site/BookingButton";
import GitHubSection from "@/components/site/GitHubSection";
import MoreLinks from "@/components/site/MoreLinks";
import { PostLines } from "@/components/site/PostList";
import { profile } from "@/lib/data";
import { toPostCard, toProjectCard } from "@/lib/media";
import { findPortrait } from "@/lib/portrait";
import { getPublicSettings, listPosts, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

const LOGO_COLORS = ["#ff6600", "#222222", "#16a34a", "#7c3aed", "#0ea5e9"];
const initials = (name: string) => {
  const caps = name.match(/[A-Z]/g) || [];
  return (caps.length >= 2 ? caps.slice(0, 2).join("") : name.slice(0, 2)).toUpperCase();
};
const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default async function Home() {
  const [settings, projects, posts, portrait] = await Promise.all([
    getPublicSettings(),
    listProjects().catch(() => []),
    listPosts().catch(() => []),
    findPortrait()
  ]);
  const cards = projects.map(toProjectCard);
  const building = cards.slice(0, 4);
  const selected = [...cards.filter(p => p.problem && p.outcome), ...cards.filter(p => !(p.problem && p.outcome))].slice(0, 3);
  const flagship = cards.find(p => p.featured) || cards[0];

  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      <section className="shell hero">
        <div>
          <span className="eyebrow hero-name">
            {profile.name}
            <a className="rss-link" href="/rss" aria-label="Subscribe via RSS" title="Subscribe via RSS"><Rss size={11} /></a>
          </span>
          <h1>
            I turn ideas into <span className="accent">working full-stack &amp; AI products.</span>
          </h1>
          <div className="hero-copy">
            <p>I’m a third-year Computer Science engineering student who builds web applications, AI-powered tools and the systems behind them.</p>
            <p>From career guidance to learning platforms, I care about software that is useful, reliable and simple to use — not just a demo.</p>
          </div>
          <p className="hero-cred">
            Student, <Link href="/about">Manav Rachna · B.Tech CSE</Link>
            {flagship && <> · Building <Link href={`/projects/${flagship.slug}`}>{flagship.name}</Link></>}
          </p>
          <div className="hero-actions">
            <BookingButton booking={settings.booking} fallbackHref="/contact" fallbackLabel="Get in touch" />
            <Link className="btn btn-ghost" href="/projects">View projects <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="hero-photo">
          {portrait ? <img src={portrait} alt={`Portrait of ${profile.name}`} width={260} height={260} fetchPriority="high" /> : <Logo size={120} title={profile.name} />}
        </div>
      </section>

      {/* ------------------------------------------------------------ highlights */}
      {settings.highlights.length > 0 && (
        <div className="shell proof">
          <div className="proof-grid">
            {settings.highlights.map((h, i) => {
              const inner = <><span className="eyebrow">{h.label}</span><strong>{h.title}</strong>{h.url && <ArrowUpRight size={16} />}</>;
              const style = { ["--d" as string]: `${i * 0.05}s` };
              if (!h.url) return <div key={i} className="proof-card" data-reveal style={style}>{inner}</div>;
              return /^https?:/.test(h.url)
                ? <a key={i} className="proof-card" href={h.url} target="_blank" rel="noreferrer" data-reveal style={style}>{inner}</a>
                : <Link key={i} className="proof-card" href={h.url} data-reveal style={style}>{inner}</Link>;
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------ what I'm building */}
      {building.length > 0 && (
        <section className="shell section" id="building">
          <div className="section-head">
            <h2 className="section-title" data-reveal>What I’m building</h2>
          </div>
          <div className="build-grid">
            {building.map((p, i) => (
              <article className="build-card" key={p.slug} data-reveal style={{ ["--d" as string]: `${(i % 2) * 0.06}s` }}>
                <div className="build-top">
                  <span className="eyebrow">{p.category.split("·")[0].trim() || "Project"}</span>
                  <span className="build-logo" style={{ background: LOGO_COLORS[i % LOGO_COLORS.length] }}>
                    {p.imageSrc && !p.imageSrc.includes("opengraph") ? <img src={p.imageSrc} alt="" /> : initials(p.name)}
                  </span>
                </div>
                <h3><Link href={`/projects/${p.slug}`}>{p.name}</Link></h3>
                <p>{p.tagline || p.description}</p>
                {p.link ? (
                  <a className="build-link" href={p.link} target="_blank" rel="noreferrer">{domain(p.link)}</a>
                ) : p.github ? (
                  <a className="build-link" href={p.github} target="_blank" rel="noreferrer">{domain(p.github)}</a>
                ) : (
                  <Link className="build-link" href={`/projects/${p.slug}`}>Read the case study</Link>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- selected work */}
      {selected.length > 0 && (
        <section className="shell section" id="work">
          <div className="section-head">
            <h2 className="section-title" data-reveal>Selected work</h2>
            <Link className="link-arrow" href="/projects">All projects <ArrowRight size={15} /></Link>
          </div>
          <div className="field-grid">
            {selected.map((p, i) => (
              <article className="field-card" key={p.slug} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <h3><Link href={`/projects/${p.slug}`}>{p.name}</Link></h3>
                <p className="problem">{p.problem || p.description}</p>
                {p.outcome && <p className="outcome">{p.outcome}</p>}
                <span className="read">Read the case study <ArrowRight size={15} /></span>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------- writing */}
      {posts.length > 0 && (
        <section className="shell section" id="writing">
          <div className="section-head">
            <h2 className="section-title" data-reveal>Writing</h2>
            <Link className="link-arrow" href="/blog">All <ArrowRight size={15} /></Link>
          </div>
          <PostLines posts={posts.slice(0, 3).map(toPostCard)} />
        </section>
      )}

      {/* ---------------------------------------------------------------- github */}
      <Suspense fallback={null}>
        <GitHubSection username={settings.githubUsername} />
      </Suspense>

      <MoreLinks />
    </>
  );
}
