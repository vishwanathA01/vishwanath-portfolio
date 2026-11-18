import type { MetadataRoute } from "next";
import { listPosts, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [projects, posts] = await Promise.all([listProjects().catch(() => []), listPosts().catch(() => [])]);
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/now`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/resume`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/rss`, changeFrequency: "monthly", priority: 0.3 },
    ...projects.map(p => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
    ...posts.map(p => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 }))
  ];
}
