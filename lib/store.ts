import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { get as blobGet, put as blobPut } from "@vercel/blob";
import { getDb } from "./db";
import { defaultSettings, seedPages, seedPosts, seedProjects } from "./data";
import type { Contact, Motif, Page, PageKey, Post, Project, Settings } from "./types";
import { MOTIFS } from "./types";

/**
 * Content store.
 *  - "mongodb": when MONGODB_URI is set.
 *  - "blob":    on Vercel when a (private) Vercel Blob store is connected. The same two JSON
 *               documents as file mode are kept in the store under cms/.
 *  - "file":    JSON files in ./data (local development):
 *      data/content.json  projects, blog posts and site settings (safe to commit)
 *      data/inbox.json    contact form messages (git-ignored: contains personal data)
 * CONTENT_STORE=file|blob forces a mode (MONGODB_URI still wins).
 */
export type StorageMode = "mongodb" | "blob" | "file";

function pickStorage(): StorageMode {
  if (process.env.MONGODB_URI) return "mongodb";
  const forced = process.env.CONTENT_STORE;
  if (forced === "file" || forced === "blob") return forced;
  const blobConnected = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
  return process.env.VERCEL && blobConnected ? "blob" : "file";
}

export const storageMode: StorageMode = pickStorage();

export class StoreError extends Error {
  constructor(message: string, public status = 503) {
    super(message);
  }
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const INBOX_FILE = path.join(DATA_DIR, "inbox.json");

type ContentFile = { projects: Project[]; posts: Post[]; settings: Partial<Settings>; pages?: Partial<Record<PageKey, Page>> };
type InboxFile = { contacts: Contact[] };

/* ---------------------------------------------------------------- helpers */

const now = () => new Date().toISOString();

export function normalizeProject(p: Partial<Project>): Project {
  return {
    slug: String(p.slug || ""),
    name: String(p.name || "Untitled project"),
    tagline: p.tagline || "",
    category: p.category || "",
    year: p.year || "",
    status: p.status || "In progress",
    role: p.role || "",
    description: p.description || "",
    problem: p.problem || "",
    outcome: p.outcome || "",
    content: p.content || "",
    features: Array.isArray(p.features) ? p.features : [],
    stack: Array.isArray(p.stack) ? p.stack : [],
    link: p.link && p.link !== "#" ? p.link : "",
    github: p.github && p.github !== "#" ? p.github : "",
    image: p.image || "",
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    motif: MOTIFS.includes(p.motif as Motif) ? (p.motif as Motif) : "stripes",
    featured: Boolean(p.featured),
    order: typeof p.order === "number" ? p.order : 99,
    updatedAt: p.updatedAt || now()
  };
}

function normalizePost(p: Partial<Post>): Post {
  return {
    slug: String(p.slug || ""),
    title: p.title || "Untitled",
    excerpt: p.excerpt || "",
    content: p.content || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    cover: p.cover || "",
    published: Boolean(p.published),
    date: p.date || now().slice(0, 10),
    updatedAt: p.updatedAt || now()
  };
}

const byProjectOrder = (a: Project, b: Project) => a.order - b.order || b.year.localeCompare(a.year) || a.name.localeCompare(b.name);
const byPostDate = (a: Post, b: Post) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title);

function mergeSettings(stored?: Partial<Settings> | null): Settings {
  const s = { ...defaultSettings, ...(stored || {}) };
  s.githubUsername = stored?.githubUsername || defaultSettings.githubUsername;
  if (!Array.isArray(s.highlights)) s.highlights = defaultSettings.highlights;
  return s;
}

/* ------------------------------------------------------------- file store */

let writeQueue: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function readLocalJson<T>(file: string, fallback: () => T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code === "ENOENT") return fallback();
    throw new StoreError(`Could not read ${path.basename(file)}: it may be corrupted.`);
  }
}

/* Vercel Blob (private store). A page render reads the content several times, so parsed
 * documents are memoised for a few seconds per instance; writes refresh the memo. */
const blobPath = (file: string) => `cms/${path.basename(file)}`;
const BLOB_MEMO_MS = 3000;
const blobMemo = new Map<string, { at: number; value: unknown }>();

async function readBlobJson<T>(file: string, fallback: () => T): Promise<T> {
  const key = blobPath(file);
  const hit = blobMemo.get(key);
  if (hit && Date.now() - hit.at < BLOB_MEMO_MS) return structuredClone(hit.value) as T;
  let text: string | null = null;
  try {
    const result = await blobGet(key, { access: "private", useCache: false });
    if (result && result.statusCode === 200) text = await new Response(result.stream).text();
  } catch (e) {
    console.error("[store] Blob read failed:", e);
    throw new StoreError("Could not reach content storage. Please try again.");
  }
  let value: T;
  if (text === null) {
    value = await readLocalJson(file, fallback); // first run: start from the bundled content
  } else {
    try {
      value = JSON.parse(text) as T;
    } catch {
      throw new StoreError(`Stored ${path.basename(file)} is corrupted.`);
    }
  }
  blobMemo.set(key, { at: Date.now(), value });
  return structuredClone(value);
}

async function writeBlobJson(file: string, data: unknown) {
  const key = blobPath(file);
  try {
    await blobPut(key, JSON.stringify(data, null, 2), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60
    });
  } catch (e) {
    console.error("[store] Blob write failed:", e);
    throw new StoreError("Could not save to content storage. Please try again.");
  }
  blobMemo.set(key, { at: Date.now(), value: structuredClone(data) });
}

async function readJson<T>(file: string, fallback: () => T): Promise<T> {
  return storageMode === "blob" ? readBlobJson(file, fallback) : readLocalJson(file, fallback);
}

async function writeJson(file: string, data: unknown) {
  if (storageMode === "blob") return writeBlobJson(file, data);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2));
    await fs.rename(tmp, file);
  } catch {
    throw new StoreError("Storage is read-only here. Connect a Vercel Blob store (or set MONGODB_URI) to edit content on this deployment.");
  }
}

const seedContent = (): ContentFile => ({ projects: seedProjects, posts: seedPosts, settings: {}, pages: {} });
const readContent = () => readJson<ContentFile>(CONTENT_FILE, seedContent);
const readInbox = () => readJson<InboxFile>(INBOX_FILE, () => ({ contacts: [] }));

/* ------------------------------------------------------------ mongo store */

async function mongo() {
  try {
    const db = await getDb();
    const meta = db.collection<{ _id: string }>("meta");
    if (!(await meta.findOne({ _id: "seeded" }))) {
      await meta.insertOne({ _id: "seeded" });
      if ((await db.collection("projects").countDocuments()) === 0) await db.collection("projects").insertMany(seedProjects.map(p => ({ ...p })));
      if ((await db.collection("posts").countDocuments()) === 0) await db.collection("posts").insertMany(seedPosts.map(p => ({ ...p })));
    }
    return db;
  } catch (e) {
    if (e instanceof StoreError) throw e;
    throw new StoreError("Database unavailable. Check MONGODB_URI.");
  }
}
const noId = { projection: { _id: 0 } };

/* --------------------------------------------------------------- projects */

export async function listProjects(): Promise<Project[]> {
  const rows = storageMode === "mongodb"
    ? await (await mongo()).collection<Project>("projects").find({}, noId).toArray()
    : (await readContent()).projects;
  return rows.map(normalizeProject).sort(byProjectOrder);
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await listProjects()).find(p => p.slug === slug) || null;
}

export async function saveProject(input: Omit<Project, "updatedAt">, originalSlug?: string): Promise<Project> {
  const project = normalizeProject({ ...input, updatedAt: now() });
  const from = originalSlug || project.slug;
  const isRename = from !== project.slug;
  if (storageMode === "mongodb") {
    const col = (await mongo()).collection<Project>("projects");
    if ((!originalSlug || isRename) && (await col.findOne({ slug: project.slug }))) throw new StoreError("A project with this slug already exists.", 409);
    await col.deleteOne({ slug: from });
    await col.insertOne({ ...project });
    return project;
  }
  return serialized(async () => {
    const content = await readContent();
    if ((!originalSlug || isRename) && content.projects.some(p => p.slug === project.slug)) throw new StoreError("A project with this slug already exists.", 409);
    const idx = content.projects.findIndex(p => p.slug === from);
    if (idx >= 0) content.projects[idx] = project;
    else content.projects.push(project);
    await writeJson(CONTENT_FILE, content);
    return project;
  });
}

export async function deleteProject(slug: string) {
  if (storageMode === "mongodb") return void (await (await mongo()).collection("projects").deleteOne({ slug }));
  await serialized(async () => {
    const content = await readContent();
    content.projects = content.projects.filter(p => p.slug !== slug);
    await writeJson(CONTENT_FILE, content);
  });
}

/* ------------------------------------------------------------------ posts */

export async function listPosts({ drafts = false } = {}): Promise<Post[]> {
  const rows = storageMode === "mongodb"
    ? await (await mongo()).collection<Post>("posts").find({}, noId).toArray()
    : (await readContent()).posts;
  return rows.map(normalizePost).filter(p => drafts || p.published).sort(byPostDate);
}

export async function getPost(slug: string, { drafts = false } = {}): Promise<Post | null> {
  return (await listPosts({ drafts })).find(p => p.slug === slug) || null;
}

export async function savePost(input: Omit<Post, "updatedAt">, originalSlug?: string): Promise<Post> {
  const post = normalizePost({ ...input, updatedAt: now() });
  const from = originalSlug || post.slug;
  const isRename = from !== post.slug;
  if (storageMode === "mongodb") {
    const col = (await mongo()).collection<Post>("posts");
    if ((!originalSlug || isRename) && (await col.findOne({ slug: post.slug }))) throw new StoreError("A post with this slug already exists.", 409);
    await col.deleteOne({ slug: from });
    await col.insertOne({ ...post });
    return post;
  }
  return serialized(async () => {
    const content = await readContent();
    if ((!originalSlug || isRename) && content.posts.some(p => p.slug === post.slug)) throw new StoreError("A post with this slug already exists.", 409);
    const idx = content.posts.findIndex(p => p.slug === from);
    if (idx >= 0) content.posts[idx] = post;
    else content.posts.push(post);
    await writeJson(CONTENT_FILE, content);
    return post;
  });
}

export async function deletePost(slug: string) {
  if (storageMode === "mongodb") return void (await (await mongo()).collection("posts").deleteOne({ slug }));
  await serialized(async () => {
    const content = await readContent();
    content.posts = content.posts.filter(p => p.slug !== slug);
    await writeJson(CONTENT_FILE, content);
  });
}

/* --------------------------------------------------------------- settings */

export async function getSettings(): Promise<Settings> {
  try {
    if (storageMode === "mongodb") {
      const doc = await (await mongo()).collection<{ _id: string } & Partial<Settings>>("settings").findOne({ _id: "site" });
      if (!doc) return mergeSettings(null);
      const { _id, ...rest } = doc;
      void _id;
      return mergeSettings(rest);
    }
    return mergeSettings((await readContent()).settings);
  } catch {
    return mergeSettings(null);
  }
}

/** Settings for public pages: hides the résumé link when it points at a file that doesn't exist yet. */
export async function getPublicSettings(): Promise<Settings> {
  const s = await getSettings();
  if (s.resume.startsWith("/")) {
    const exists = await fs.stat(path.join(process.cwd(), "public", s.resume)).then(() => true, () => false);
    if (!exists) s.resume = "";
  }
  return s;
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  if (storageMode === "mongodb") {
    await (await mongo()).collection<{ _id: string } & Partial<Settings>>("settings").updateOne({ _id: "site" }, { $set: settings }, { upsert: true });
    return mergeSettings(settings);
  }
  return serialized(async () => {
    const content = await readContent();
    content.settings = settings;
    await writeJson(CONTENT_FILE, content);
    return mergeSettings(settings);
  });
}

/* ------------------------------------------------------------------ pages */

export async function getPage(key: PageKey): Promise<Page> {
  try {
    const stored = storageMode === "mongodb"
      ? await (await mongo()).collection<{ _id: string } & Page>("pages").findOne({ _id: key }, noId)
      : (await readContent()).pages?.[key];
    return stored ? { ...seedPages[key], ...stored, key } : seedPages[key];
  } catch {
    return seedPages[key];
  }
}

export async function savePage(page: Omit<Page, "updatedAt">): Promise<Page> {
  const saved: Page = { ...page, updatedAt: now() };
  if (storageMode === "mongodb") {
    await (await mongo()).collection<{ _id: string } & Page>("pages").updateOne({ _id: page.key }, { $set: saved }, { upsert: true });
    return saved;
  }
  return serialized(async () => {
    const content = await readContent();
    content.pages = { ...(content.pages || {}), [page.key]: saved };
    await writeJson(CONTENT_FILE, content);
    return saved;
  });
}

/* --------------------------------------------------------------- contacts */

const HOUR = 60 * 60 * 1000;

export async function addContact(input: Pick<Contact, "name" | "email" | "subject" | "message">, ip: string) {
  const contact: Contact = { ...input, id: randomUUID(), ip, createdAt: now(), read: false };
  const since = new Date(Date.now() - HOUR).toISOString();
  if (storageMode === "mongodb") {
    const col = (await mongo()).collection<Contact>("contacts");
    if ((await col.countDocuments({ ip, createdAt: { $gt: since } })) >= 5) throw new StoreError("Too many messages. Please try again later.", 429);
    await col.insertOne({ ...contact });
    return;
  }
  await serialized(async () => {
    const inbox = await readInbox();
    if (inbox.contacts.filter(c => c.ip === ip && c.createdAt > since).length >= 5) throw new StoreError("Too many messages. Please try again later.", 429);
    inbox.contacts = [contact, ...inbox.contacts].slice(0, 1000);
    await writeJson(INBOX_FILE, inbox);
  });
}

export async function listContacts(): Promise<Contact[]> {
  const rows = storageMode === "mongodb"
    ? await (await mongo()).collection<Contact>("contacts").find({}, noId).sort({ createdAt: -1 }).limit(200).toArray()
    : (await readInbox()).contacts;
  return rows.map(c => ({ ...c, createdAt: typeof c.createdAt === "string" ? c.createdAt : new Date(c.createdAt).toISOString() }));
}

export async function updateContact(id: string, change: { read?: boolean; remove?: boolean }) {
  if (storageMode === "mongodb") {
    const col = (await mongo()).collection<Contact>("contacts");
    if (change.remove) await col.deleteOne({ id });
    else await col.updateOne({ id }, { $set: { read: Boolean(change.read) } });
    return;
  }
  await serialized(async () => {
    const inbox = await readInbox();
    inbox.contacts = change.remove
      ? inbox.contacts.filter(c => c.id !== id)
      : inbox.contacts.map(c => (c.id === id ? { ...c, read: Boolean(change.read) } : c));
    await writeJson(INBOX_FILE, inbox);
  });
}
