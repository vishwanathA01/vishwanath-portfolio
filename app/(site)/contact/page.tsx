import type { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import BookingButton from "@/components/site/BookingButton";
import ContactForm from "@/components/site/ContactForm";
import MoreLinks from "@/components/site/MoreLinks";
import { profile } from "@/lib/data";
import { Markdown } from "@/lib/markdown";
import { getPage, getPublicSettings } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact", description: `How to reach ${profile.name} for internships, collaborations and projects.` };

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getPublicSettings()]);
  const githubUrl = settings.githubUsername ? `https://github.com/${settings.githubUsername}` : "";
  return (
    <>
      <section className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <span>Contact</span></div>
        <h1>{page.title}<em>.</em></h1>
        {page.intro && <p className="intro-copy">{page.intro}</p>}
        <div className="hero-actions">
          <a className="btn" href={`mailto:${settings.email}`}><Mail size={15} /> {settings.email}</a>
          {settings.booking && <BookingButton booking={settings.booking} className="btn btn-ghost" />}
        </div>
      </section>
      <div className="shell md-page" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)" }}>
        <div data-reveal>
          <Markdown source={page.content} />
          <div className="side-box" style={{ marginTop: 40 }}>
            <span className="eyebrow"><MapPin size={12} /> Based in {settings.location}</span>
            <p>Open to remote and on-site opportunities. I usually reply within two days.</p>
            <div className="socials">
              <a href={`mailto:${settings.email}`} aria-label="Email"><Mail size={16} /></a>
              {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>}
              {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>}
              {settings.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter"><Twitter size={16} /></a>}
            </div>
          </div>
        </div>
        <div style={{ alignSelf: "start", position: "sticky", top: 100 }}>
          <ContactForm />
        </div>
      </div>
      <MoreLinks current="contact" />
    </>
  );
}
