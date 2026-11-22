import { profile } from "@/lib/data";
import { ogContentType, ogImageSrc, ogSize, renderOg } from "@/lib/og";
import { getProject } from "@/lib/store";

export const alt = `Project case study by ${profile.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProject(slug).catch(() => null);
  if (!p) return renderOg({ kind: "Projects", title: "Case studies", subtitle: profile.summary });
  return renderOg({
    kind: "Case study",
    title: p.name,
    subtitle: p.tagline || p.description,
    tags: p.stack,
    image: await ogImageSrc(p.image)
  });
}
