import { z } from "zod";
import { MOTIFS, PAGE_KEYS } from "./types";

const MAX_IMAGE_CHARS = 3_500_000; // ~2.5 MB of base64 image data

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine(v => v === "" || v === "#" || /^https?:\/\//i.test(v) || v.startsWith("/"), "Must be a URL starting with http(s):// or /");

export const imageValue = z
  .string()
  .trim()
  .max(MAX_IMAGE_CHARS)
  .refine(
    v => v === "" || /^https?:\/\//i.test(v) || v.startsWith("/") || /^data:image\/(png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/.test(v),
    "Images must be an http(s) URL, a site path or an uploaded image"
  );

const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().max(120).optional().transform(v => v || "Portfolio enquiry"),
  message: z.string().trim().min(10).max(3000)
});

export const projectSchema = z.object({
  originalSlug: z.string().max(80).optional(),
  slug,
  name: z.string().trim().min(2).max(100),
  tagline: z.string().trim().max(200).default(""),
  category: z.string().trim().max(80).default(""),
  year: z.string().trim().max(9).default(""),
  status: z.string().trim().max(40).default("In progress"),
  role: z.string().trim().max(80).default(""),
  description: z.string().trim().min(10).max(1000),
  problem: z.string().trim().max(1000).default(""),
  outcome: z.string().trim().max(1000).default(""),
  content: z.string().max(40_000).default(""),
  features: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  stack: z.array(z.string().trim().min(1).max(40)).max(16).default([]),
  link: optionalUrl.default(""),
  github: optionalUrl.default(""),
  image: imageValue.default(""),
  gallery: z.array(imageValue.refine(v => v !== "", "Empty image")).max(8).default([]),
  motif: z.enum(MOTIFS as [string, ...string[]]).default("stripes"),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(999).default(99)
});

export const postSchema = z.object({
  originalSlug: z.string().max(80).optional(),
  slug,
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().max(400).default(""),
  content: z.string().min(1).max(100_000),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
  cover: imageValue.default(""),
  published: z.boolean().default(false),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
});

export const settingsSchema = z.object({
  githubUsername: z
    .string()
    .trim()
    .max(39)
    .regex(/^$|^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/, "Not a valid GitHub username"),
  email: z.string().trim().email().max(160),
  linkedin: optionalUrl,
  twitter: optionalUrl.default(""),
  booking: optionalUrl.default(""),
  location: z.string().trim().max(80),
  resume: optionalUrl,
  available: z.boolean(),
  highlights: z
    .array(z.object({ label: z.string().trim().min(1).max(30), title: z.string().trim().min(1).max(80), url: optionalUrl.default("") }))
    .max(6)
    .default([])
});

export const pageSchema = z.object({
  key: z.enum(PAGE_KEYS),
  title: z.string().trim().min(1).max(80),
  intro: z.string().trim().max(400).default(""),
  content: z.string().max(60_000).default("")
});
