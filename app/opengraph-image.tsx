import { profile } from "@/lib/data";
import { ogContentType, ogImageSrc, ogSize, renderOg } from "@/lib/og";
import { findPortrait } from "@/lib/portrait";

export const alt = `${profile.name} — ${profile.shortRole}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const portrait = await ogImageSrc(await findPortrait());
  return renderOg({
    kind: "Portfolio",
    title: "I turn ideas into working full-stack & AI products.",
    subtitle: `${profile.education.year} B.Tech CSE student at Manav Rachna, building web apps and practical AI tools.`,
    tags: ["Next.js", "React", "Python", "Generative AI"],
    image: portrait,
    portrait: true
  });
}
