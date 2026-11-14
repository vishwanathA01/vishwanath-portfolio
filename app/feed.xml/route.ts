import { profile } from "@/lib/data";
import { listPosts } from "@/lib/store";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * RSS 2.0 feed of published blog posts.
 * Served as application/xml so browsers display it instead of downloading it.
 * Humans are pointed to the /rss page, which explains how to subscribe.
 */
export async function GET(req: Request) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
  const posts = await listPosts().catch(() => []);
  const updated = posts.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), posts[0]?.updatedAt || new Date().toISOString());
  const items = posts
    .map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <dc:creator>${esc(profile.name)}</dc:creator>
      <description>${esc(p.excerpt)}</description>
${p.tags.map(t => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(profile.name)} — Writing</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(`Notes on building, design and engineering by ${profile.name}.`)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600"
    }
  });
}
