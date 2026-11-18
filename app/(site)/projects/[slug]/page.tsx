import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import Shot from "@/components/site/Shot";
import { Markdown } from "@/lib/markdown";
import { projectGallery, projectImage } from "@/lib/media";
import { getProject, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug).catch(() => null);
  if (!p) return { title: "Project not found" };
  return { title: p.name, description: p.tagline || p.description, openGraph: { title: p.name, description: p.tagline || p.description } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await listProjects().catch(() => []);
  const idx = projects.findIndex(p => p.slug === slug);
  if (idx < 0) notFound();
  const p = projects[idx];
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const image = projectImage(p);
  const gallery = projectGallery(p);
  const live = ["live", "featured"].includes(p.status.toLowerCase());

  return (
    <article>
      <header className="shell page-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span>/</span> <Link href="/projects">Projects</Link> <span>/</span> <span>{p.name}</span>
        </nav>
        <div className="meta-line">
          {p.category && <span>{p.category}</span>}
          {p.year && <><span>·</span><span>{p.year}</span></>}
          <span className={`status-pill${live ? " live" : ""}`}>{p.status}</span>
        </div>
        <h1>{p.name}{p.tagline ? <>: <span style={{ fontWeight: 500 }}>{p.tagline.replace(/\.$/, "").replace(/^./, c => c.toLowerCase())}</span></> : null}</h1>
        <p className="intro-copy">{p.description}</p>
        {p.stack.length > 0 && <div className="tags" style={{ marginTop: 22 }}>{p.stack.map(t => <span className="tag" key={t}>{t}</span>)}</div>}
        <div className="head-rule" />
      </header>

      <div className="case-page">
        {p.role && (
          <p className="callout">
            <strong>My role.</strong> {p.role}{p.year ? `, ${p.year}` : ""}. {live ? "The project is complete and documented below." : `Status: ${p.status.toLowerCase()} — the write-up reflects where it stands today.`}
          </p>
        )}

        {image && (
          <figure style={{ margin: "34px 0 0" }}>
            <div className="project-hero"><Shot slug={p.slug}><img src={image} alt={`${p.name} screenshot`} /></Shot></div>
          </figure>
        )}

        {(p.problem || p.outcome) && (
          <div className="po-block" data-reveal>
            {p.problem && <div><span className="label">The problem</span><p>{p.problem}</p></div>}
            {p.outcome && <div><span className="label">Outcome</span><p>{p.outcome}</p></div>}
          </div>
        )}

        {p.features.length > 0 && (
          <section style={{ marginTop: 44 }} data-reveal>
            <h2 style={{ fontSize: 30, marginBottom: 16 }}>Key features</h2>
            <ul className="feature-list">
              {p.features.map((f, i) => <li key={f}><span>{String(i + 1).padStart(2, "0")}</span>{f}</li>)}
            </ul>
          </section>
        )}

        {p.content && (
          <section style={{ marginTop: 44 }}>
            <Markdown source={p.content} />
          </section>
        )}

        {gallery.length > 0 && (
          <section style={{ marginTop: 50 }} data-reveal>
            <h2 style={{ fontSize: 30 }}>Screenshots</h2>
            <div className="gallery">
              {gallery.map((g, i) => (
                <a key={i} href={g} target="_blank" rel="noreferrer"><img src={g} alt={`${p.name} screenshot ${i + 1}`} loading="lazy" /></a>
              ))}
            </div>
          </section>
        )}

        <div className="links-box">
          <span className="eyebrow">Links</span>
          <ul>
            {p.link && <li><a href={p.link} target="_blank" rel="noreferrer">Live demo <ExternalLink size={13} /></a></li>}
            {p.github && <li><a href={p.github} target="_blank" rel="noreferrer">Source on GitHub <Github size={13} /></a></li>}
            <li><Link href="/projects">All projects <ArrowRight size={13} /></Link></li>
            <li><Link href="/contact">Discuss a similar project <ArrowRight size={13} /></Link></li>
          </ul>
        </div>
      </div>

      {projects.length > 1 && (
        <nav className="shell pager" aria-label="More projects">
          <Link href={`/projects/${prev.slug}`}>
            <span className="eyebrow"><ArrowLeft size={13} /> Previous</span>
            <strong>{prev.name}</strong>
          </Link>
          <Link href={`/projects/${next.slug}`}>
            <span className="eyebrow" style={{ justifyContent: "flex-end" }}>Next <ArrowRight size={13} /></span>
            <strong>{next.name}</strong>
          </Link>
        </nav>
      )}
    </article>
  );
}
