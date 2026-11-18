import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, FileText, Rss } from "lucide-react";
import Logo from "@/components/Logo";
import BookingButton from "@/components/site/BookingButton";
import CountUp from "@/components/site/CountUp";
import GitHubSection from "@/components/site/GitHubSection";
import JsonLd from "@/components/site/JsonLd";
import MoreLinks from "@/components/site/MoreLinks";
import { PostLines } from "@/components/site/PostList";
import RotatingWords from "@/components/site/RotatingWords";
import Shot from "@/components/site/Shot";
import SkillsExplorer from "@/components/site/SkillsExplorer";
import { journey, profile, skills } from "@/lib/data";
import { getGitHubSummary } from "@/lib/github";
import { toPostCard, toProjectCard } from "@/lib/media";
import { findPortrait, findProjectLogos } from "@/lib/portrait";
import { siteOrigin } from "@/lib/site";
import { getPublicSettings, listPosts, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

const LOGO_COLORS = ["#ff6600", "#222222", "#16a34a", "#7c3aed", "#0ea5e9"];
const initials = (name: string) => {
  const caps = name.match(/[A-Z]/g) || [];
  return (caps.length >= 2 ? caps.slice(0, 2).join("") : name.slice(0, 2)).toUpperCase();
};
const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const ROLES = ["full-stack & AI products.", "AI-powered career tools.", "learning platforms.", "fast, reliable web apps."];
/** Tools & technologies (everything except the CS-fundamentals group). */
const TECH = Array.from(new Set(skills.filter(s => s.group !== "CS Foundations").flatMap(s => s.items)));

export default async function Home() {
  const [settings, projects, posts, portrait, origin] = await Promise.all([
    getPublicSettings(),
    listProjects().catch(() => []),
    listPosts().catch(() => []),
    findPortrait(),
    siteOrigin()
  ]);
  const github = await getGitHubSummary(settings.githubUsername);
  const cards = projects.map(toProjectCard);
  const building = cards.slice(0, 4);
  const selected = [...cards.filter(p => p.problem && p.outcome), ...cards.filter(p => !(p.problem && p.outcome))].slice(0, 3);
  const flagship = cards.find(p => p.featured) || cards[0];
  const logos = await findProjectLogos(building.map(p => p.slug));
  const liveCount = projects.filter(p => p.link && ["live", "featured"].includes(p.status.toLowerCase())).length;
  const stats = [
    { value: projects.length, label: "Case studies" },
    { value: liveCount, label: "Live products" },
    { value: TECH.length, label: "Tools & technologies" },
    ...(github ? [{ value: github.user.public_repos, label: "Public repositories" }] : [])
  ].filter(s => s.value > 0);
  const sameAs = [settings.githubUsername && `https://github.com/${settings.githubUsername}`, settings.linkedin, settings.twitter].filter(Boolean);

  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          url: origin,
          image: `${origin}/profile.jpg`,
          jobTitle: profile.shortRole,
          description: profile.summary,
          email: `mailto:${settings.email}`,
          address: { "@type": "PostalAddress", addressCountry: settings.location },
          alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.institution },
          knowsAbout: TECH,
          sameAs
        }}
      />
      <section className="shell hero">
        <div>
          <div className="hero-top">
            <span className="eyebrow hero-name">
              {profile.name}
              <a className="rss-link" href="/rss" aria-label="Subscribe via RSS" title="Subscribe via RSS"><Rss size={11} /></a>
            </span>
            {settings.available && (
              <Link href="/now" className="avail"><i aria-hidden="true" /> Open to internships · {settings.location}</Link>
            )}
          </div>
          <h1>
            I turn ideas into working <span className="accent"><RotatingWords words={ROLES} /></span>
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
            <Link className="hero-link" href="/resume"><FileText size={15} /> Résumé</Link>
          </div>
          {stats.length > 0 && (
            <dl className="hero-stats">
              {stats.map(s => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd><CountUp value={s.value} /></dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="hero-visual">
          <svg className="hero-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="ring-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" /></defs>
            <text><textPath href="#ring-path" textLength="548" lengthAdjust="spacing">BUILD · SHIP · LEARN · REPEAT · BUILD · SHIP · LEARN · REPEAT ·</textPath></text>
          </svg>
          <div className="hero-photo">
            {portrait ? <img src={portrait} alt={`Portrait of ${profile.name}`} width={260} height={260} fetchPriority="high" /> : <Logo size={120} title={profile.name} />}
          </div>
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

      {/* ------------------------------------------------------------- marquee */}
      <div className="marquee" aria-label="Tools I work with">
        <div className="marquee-track">
          {[0, 1].map(copy => (
            <ul key={copy} aria-hidden={copy === 1 || undefined}>
              {TECH.map(t => <li key={t}>{t}</li>)}
            </ul>
          ))}
        </div>
      </div>

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
                    {logos[p.slug] ? <img src={logos[p.slug]} alt={`${p.name} logo`} /> : initials(p.name)}
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
                {p.imageSrc && <div className="field-media"><Shot slug={p.slug}><img src={p.imageSrc} alt={`${p.name} screenshot`} loading="lazy" /></Shot></div>}
                <h3><Link href={`/projects/${p.slug}`}>{p.name}</Link></h3>
                <p className="problem">{p.problem || p.description}</p>
                {p.outcome && <p className="outcome">{p.outcome}</p>}
                <span className="read">Read the case study <ArrowRight size={15} /></span>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- skills */}
      <section className="shell section" id="skills">
        <div className="section-head">
          <h2 className="section-title" data-reveal>Toolkit</h2>
          <p data-reveal>Pick a skill to see the case studies where I’ve actually used it.</p>
        </div>
        <div data-reveal>
          <SkillsExplorer groups={skills} projects={projects.map(p => ({ slug: p.slug, name: p.name, stack: p.stack }))} />
        </div>
      </section>

      {/* --------------------------------------------------------------- journey */}
      <section className="shell section" id="journey">
        <div className="section-head">
          <h2 className="section-title" data-reveal>Journey</h2>
          <Link className="link-arrow" href="/about">The longer story <ArrowRight size={15} /></Link>
        </div>
        <ol className="timeline">
          {journey.map((j, i) => (
            <li key={j.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }} data-current={i === journey.length - 1 || undefined}>
              <span className="tl-period">{j.period}</span>
              <div className="tl-card">
                <h3>{j.title}</h3>
                <span className="tl-place">{j.place}</span>
                <p>{j.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

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
