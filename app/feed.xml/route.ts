import { profile } from "@/lib/data";
import { postCover } from "@/lib/media";
import { listPosts } from "@/lib/store";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * RSS 2.0 feed of published blog posts.
 * Served as application/xml so browsers display it instead of downloading it.
 * Humans are pointed to the /rss page, which explains how to subscribe.
 * Includes Feedly's webfeeds extension (icon, logo, accent colour, open-in-browser cards)
 * and media:content images so posts render nicely in Feedly and other readers.
 */
export async function GET(req: Request) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
  const abs = (u: string) => (/^https?:\/\//i.test(u) ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`);
  const posts = await listPosts().catch(() => []);
  const updated = posts.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), posts[0]?.updatedAt || new Date().toISOString());
  const title = `${profile.name} — Writing`;
  const items = posts
    .map(p => {
      const cover = postCover(p);
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <dc:creator>${esc(profile.name)}</dc:creator>
      <description>${esc(p.excerpt)}</description>
${p.tags.map(t => `      <category>${esc(t)}</category>`).join("\n")}${cover ? `\n      <media:content url="${esc(abs(cover))}" medium="image" />` : ""}
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:webfeeds="http://webfeeds.org/rss/1.0">
  <channel>
    <title>${esc(title)}</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(`Notes on building, design and engineering by ${profile.name}.`)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <image>
      <url>${base}/profile.jpg</url>
      <title>${esc(title)}</title>
      <link>${base}/blog</link>
    </image>
    <webfeeds:icon>${base}/icon.svg</webfeeds:icon>
    <webfeeds:logo>${base}/logo.svg</webfeeds:logo>
    <webfeeds:accentColor>FF6600</webfeeds:accentColor>
    <webfeeds:related layout="card" target="browser" />
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
