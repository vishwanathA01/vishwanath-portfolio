import Link from "next/link";
import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react";
import LocalTime from "@/components/site/LocalTime";
import type { Settings } from "@/lib/types";

export default function Footer({ name, settings, githubUrl }: { name: string; settings: Settings; githubUrl: string }) {
  return (
    <footer className="footer">
      <div className="shell footer-row">
        <div className="footer-brand">
          <strong>{name}</strong>
          <span>{new Date().getFullYear()} · <a href={`mailto:${settings.email}`}>{settings.email}</a></span>
          <span className="footer-time">{settings.location} · <LocalTime /></span>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/now">Now</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/resume">Résumé</Link>
        </nav>
        <div className="socials">
          {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>}
          {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>}
          {settings.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter"><Twitter size={16} /></a>}
          <a href={`mailto:${settings.email}`} aria-label="Email"><Mail size={16} /></a>
          <Link href="/rss" aria-label="Subscribe via RSS"><Rss size={16} /></Link>
        </div>
      </div>
    </footer>
  );
}
