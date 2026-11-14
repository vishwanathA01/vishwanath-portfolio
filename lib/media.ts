import type { Post, PostCard, Project, ProjectCard } from "./types";

/** Uploaded images are stored inline as data URLs; serve them through /media so pages stay light. */
function resolve(value: string, route: string, updatedAt: string): string {
  if (!value) return "";
  if (value.startsWith("data:")) return `${route}?v=${Date.parse(updatedAt) || 0}`;
  return value;
}

/** GitHub renders a social preview image for every public repository. */
export function githubPreview(githubUrl: string): string {
  const m = githubUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  return m ? `https://opengraph.githubassets.com/1/${m[1]}/${m[2].replace(/\.git$/, "")}` : "";
}

export const projectImage = (p: Project) => resolve(p.image, `/media/projects/${p.slug}/cover`, p.updatedAt);
export const projectGallery = (p: Project) => p.gallery.map((g, i) => resolve(g, `/media/projects/${p.slug}/${i}`, p.updatedAt));
export const postCover = (p: Post) => resolve(p.cover, `/media/posts/${p.slug}/cover`, p.updatedAt);

export function readingTime(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 220));
}

export function toProjectCard(p: Project): ProjectCard {
  const { content, gallery, image, ...rest } = p;
  void content; void gallery; void image;
  return { ...rest, imageSrc: projectImage(p) };
}

export function toPostCard(p: Post): PostCard {
  const { content, cover, ...rest } = p;
  void cover;
  return { ...rest, coverSrc: postCover(p), readingTime: readingTime(content) };
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
