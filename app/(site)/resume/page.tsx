import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import PrintButton from "@/components/site/PrintButton";
import { journey, profile, skills } from "@/lib/data";
import { siteOrigin } from "@/lib/site";
import { getPublicSettings, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name} — ${profile.shortRole}. Education, skills and projects, printable as a PDF.`
};

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * A one-page, ATS-friendly résumé generated from the same data as the rest of the site,
 * so it never goes out of date. "Save as PDF" uses the browser's print dialog with print styles.
 */
export default async function ResumePage() {
  const [settings, projects, origin] = await Promise.all([getPublicSettings(), listProjects().catch(() => []), siteOrigin()]);
  const github = settings.githubUsername ? `https://github.com/${settings.githubUsername}` : "";
  // Live, verifiable work first, then featured case studies.
  const rank = (p: (typeof projects)[number]) => (p.link ? 0 : 2) + (p.featured ? 0 : 1);
  const top = [...projects].sort((a, b) => rank(a) - rank(b) || a.order - b.order).slice(0, 5);
  const contact = [
    settings.location,
    settings.email && { href: `mailto:${settings.email}`, text: settings.email },
    { href: origin, text: bare(origin) },
    github && { href: github, text: bare(github) },
    settings.linkedin && { href: settings.linkedin, text: bare(settings.linkedin) }
  ].filter(Boolean) as (string | { href: string; text: string })[];

  return (
    <>
      <section className="shell page-head no-print">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <span>Résumé</span></div>
        <h1>Résumé<em>.</em></h1>
        <p className="intro-copy">Always up to date — generated from the same content as this site. Save it as a PDF or print it in one click.</p>
        <div className="hero-actions">
          <PrintButton />
          {settings.resume && (
            <a className="btn btn-ghost btn-sm" href={settings.resume} target="_blank" rel="noreferrer"><Download size={14} /> Original PDF</a>
          )}
          <Link className="btn btn-ghost btn-sm" href="/contact">Contact me</Link>
        </div>
      </section>

      <div className="shell resume-wrap">
        <article className="resume" aria-label={`Résumé of ${profile.name}`}>
          <header className="cv-head">
            <div>
              <h2 className="cv-name">{profile.name}</h2>
              <p className="cv-role">{profile.role}</p>
            </div>
            <ul className="cv-contact">
              {contact.map(c => (
                <li key={typeof c === "string" ? c : c.href}>
                  {typeof c === "string" ? c : <a href={c.href}>{c.text}</a>}
                </li>
              ))}
            </ul>
          </header>

          <section className="cv-section">
            <h3>Profile</h3>
            <p>{profile.summary}</p>
          </section>

          <section className="cv-section">
            <h3>Education</h3>
            <div className="cv-item">
              <div className="cv-item-head">
                <strong>{profile.education.degree}</strong>
                <span>{profile.education.period}</span>
              </div>
              <p className="cv-sub">{profile.education.institution} · {profile.education.year}</p>
            </div>
          </section>

          <section className="cv-section">
            <h3>Skills</h3>
            <dl className="cv-skills">
              {skills.map(s => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="cv-section">
            <h3>Selected projects</h3>
            {top.map(p => (
              <div className="cv-item" key={p.slug}>
                <div className="cv-item-head">
                  <strong>
                    {p.name}
                    {p.link && <a className="cv-link" href={p.link}>{bare(p.link)} <ExternalLink size={11} className="no-print" /></a>}
                  </strong>
                  <span>{[p.role, p.year].filter(Boolean).join(" · ")}</span>
                </div>
                <p className="cv-sub">{p.stack.join(" · ")}</p>
                <ul>
                  <li>{p.tagline || p.description}</li>
                  {p.outcome && <li>{p.outcome}</li>}
                </ul>
              </div>
            ))}
            {projects.length > top.length && (
              <p className="cv-sub">
                {projects.length - top.length} more case studies at <a href={`${origin}/projects`}>{bare(origin)}/projects</a>
              </p>
            )}
          </section>

          <section className="cv-section">
            <h3>Experience &amp; direction</h3>
            {journey.map(j => (
              <div className="cv-item" key={j.title}>
                <div className="cv-item-head">
                  <strong>{j.title}</strong>
                  <span>{j.period}</span>
                </div>
                <p className="cv-sub">{j.place}</p>
                <p>{j.text}</p>
              </div>
            ))}
          </section>

          <section className="cv-section">
            <h3>Interests</h3>
            <p>{profile.interests.join(" · ")}</p>
          </section>
        </article>
      </div>
    </>
  );
}
