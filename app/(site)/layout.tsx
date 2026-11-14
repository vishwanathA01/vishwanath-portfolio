import { LogoDraw } from "@/components/Logo";
import Assistant from "@/components/site/Assistant";
import CommandPalette from "@/components/site/CommandPalette";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import Reveal from "@/components/site/Reveal";
import { profile } from "@/lib/data";
import { getPublicSettings, listPosts, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, projects, posts] = await Promise.all([
    getPublicSettings(),
    listProjects().catch(() => []),
    listPosts().catch(() => [])
  ]);
  const githubUrl = settings.githubUsername ? `https://github.com/${settings.githubUsername}` : "";

  return (
    <div id="top">
      <a href="#main" className="skip">Skip to content</a>
      <div className="intro" aria-hidden="true">
        <LogoDraw />
        <div className="intro-name">{profile.name}</div>
      </div>
      <Header name={profile.name} role="CSE student · Developer" />
      <main id="main">{children}</main>
      <Footer name={profile.name} settings={settings} githubUrl={githubUrl} />
      <Assistant firstName={profile.firstName} />
      <CommandPalette
        projects={projects.map(p => ({ slug: p.slug, name: p.name, category: p.category }))}
        posts={posts.map(p => ({ slug: p.slug, title: p.title }))}
        email={settings.email}
        github={githubUrl}
        linkedin={settings.linkedin}
      />
      <Reveal />
    </div>
  );
}
