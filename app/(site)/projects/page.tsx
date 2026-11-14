import type { Metadata } from "next";
import Link from "next/link";
import ProjectsView from "@/components/site/ProjectsView";
import { toProjectCard } from "@/lib/media";
import { listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects", description: "Case studies of academic and independent projects by Vishwanath Thakur." };

export default async function ProjectsPage() {
  const projects = await listProjects().catch(() => []);
  return (
    <>
      <section className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <span>Projects</span></div>
        <div className="meta-line"><span>Case studies</span></div>
        <h1>Projects</h1>
        <p className="intro-copy">
          {projects.length} projects across AI, full-stack web, education technology, creative coding and algorithms — each written up as a case study: the problem, what I built (with a flow diagram), what was hard, and the outcome.
        </p>
      </section>
      <section className="shell" style={{ paddingBottom: 120 }}>
        <ProjectsView projects={projects.map(toProjectCard)} />
      </section>
    </>
  );
}
