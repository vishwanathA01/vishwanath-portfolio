import { profile } from "@/lib/data";
import { formatDate, readingTime } from "@/lib/media";
import { ogContentType, ogImageSrc, ogSize, renderOg } from "@/lib/og";
import { listPosts } from "@/lib/store";

export const alt = `Article by ${profile.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await listPosts().catch(() => [])).find(p => p.slug === slug);
  if (!post) return renderOg({ kind: "Writing", title: "Notes on building & design", subtitle: profile.summary });
  return renderOg({
    kind: `Writing · ${formatDate(post.date)} · ${readingTime(post.content)} min read`,
    title: post.title,
    subtitle: post.excerpt,
    tags: post.tags.map(t => `#${t}`),
    image: await ogImageSrc(post.cover)
  });
}
