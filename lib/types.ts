export type Motif = "network" | "grid" | "radial" | "flow" | "bars" | "stripes";

export const MOTIFS: Motif[] = ["network", "grid", "radial", "flow", "bars", "stripes"];
export const PROJECT_STATUSES = ["Featured", "Live", "In progress", "Academic", "Exploration", "Archived"] as const;

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  status: string;
  role: string;
  description: string;
  problem: string;
  outcome: string;
  content: string;
  features: string[];
  stack: string[];
  link: string;
  github: string;
  image: string;
  gallery: string[];
  motif: Motif;
  featured: boolean;
  order: number;
  updatedAt: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover: string;
  published: boolean;
  date: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
  createdAt: string;
  read: boolean;
};

export type Highlight = { label: string; title: string; url: string };

export type Settings = {
  githubUsername: string;
  email: string;
  linkedin: string;
  twitter: string;
  booking: string;
  location: string;
  resume: string;
  available: boolean;
  highlights: Highlight[];
};

export const PAGE_KEYS = ["now", "about", "contact"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export type Page = { key: PageKey; title: string; intro: string; content: string; updatedAt: string };

/** Light-weight project shape that is safe to send to the browser (no inline image data). */
export type ProjectCard = Omit<Project, "content" | "gallery" | "image"> & { imageSrc: string };
export type PostCard = Omit<Post, "content" | "cover"> & { coverSrc: string; readingTime: number };
