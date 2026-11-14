import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Logo from "@/components/Logo";
import MoreLinks from "@/components/site/MoreLinks";
import { journey, profile, skills } from "@/lib/data";
import { Markdown } from "@/lib/markdown";
import { findPortrait } from "@/lib/portrait";
import { getPage, getPublicSettings } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "About", description: `The longer story of ${profile.name}, ${profile.shortRole}.` };

export default async function AboutPage() {
  const [page, settings, portrait] = await Promise.all([getPage("about"), getPublicSettings(), findPortrait()]);
  const githubUrl = settings.githubUsername ? `https://github.com/${settings.githubUsername}` : "";
  return (
    <>
      <section className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <span>About</span></div>
        <h1>{page.title}<em>.</em></h1>
        {page.intro && <p className="intro-copy">{page.intro}</p>}
      </section>
      <div className="shell md-page">
        <div data-reveal>
          <Markdown source={page.content} />
          <h2 className="section-title" style={{ fontSize: 30, marginTop: 56 }}>Journey</h2>
          <div className="steps" style={{ marginTop: 18 }}>
            {journey.map(j => (
              <div className="step" key={j.title}>
                <span className="num">{j.period}</span>
                <h3>{j.title}</h3>
                <span className="place">{j.place}</span>
                <p>{j.text}</p>
              </div>
            ))}
          </div>
          <h2 className="section-title" style={{ fontSize: 30, marginTop: 56 }}>Toolkit</h2>
          <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
            {skills.map(s => (
              <div key={s.group} style={{ display: "grid", gap: 8 }}>
                <span className="eyebrow">{s.group}</span>
                <div className="tags">{s.items.map(t => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
        <aside className="md-side">
          <div className="portrait">
            {portrait ? <img src={portrait} alt={`Portrait of ${profile.name}`} width={180} height={180} /> : <Logo size={150} className="logo-big" title={profile.name} />}
          </div>
          <div className="side-card">
            <dl>
              <div className="id-row"><dt>Name</dt><dd>{profile.name}</dd></div>
              <div className="id-row"><dt>Degree</dt><dd>{profile.education.degree}</dd></div>
              <div className="id-row"><dt>Year</dt><dd>{profile.education.year} · {profile.education.period}</dd></div>
              <div className="id-row"><dt>Institute</dt><dd>{profile.education.institution}</dd></div>
              <div className="id-row"><dt>Based in</dt><dd>{settings.location}</dd></div>
            </dl>
          </div>
          <div className="socials">
            <a href={`mailto:${settings.email}`} aria-label="Email"><Mail size={16} /></a>
            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>}
            {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>}
            {settings.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter"><Twitter size={16} /></a>}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-sm" href="/contact">Work with me <ArrowUpRight size={14} /></Link>
            {settings.resume && <a className="btn btn-ghost btn-sm" href={settings.resume} target="_blank" rel="noreferrer"><Download size={14} /> Résumé</a>}
          </div>
        </aside>
      </div>
      <MoreLinks current="about" />
    </>
  );
}
