# Vishwanath Thakur — Portfolio

Personal portfolio of **Vishwanath Thakur**, a third-year B.Tech Computer Science student at Manav Rachna who builds full-stack web apps and practical AI tools.

**Live site:** https://vishwanath-portfolio-seven.vercel.app

Projects are written up as case studies with architecture flowcharts. The site also has a blog with an RSS feed, a printable résumé, an AI assistant that answers questions about my work, and a private admin panel for editing everything without touching code.

Built with **Next.js 16** (App Router, Turbopack), **React 19** and **TypeScript**.

---

## Features

### Home page
- **Hero:** availability badge, rotating headline, count-up stats (case studies, live products, technologies, GitHub repositories) and a portrait with a rotating text ring.
- **Tech marquee:** a scrolling strip of the tools I work with.
- **What I'm building / Selected work:** project cards with logos, screenshots, problem and outcome.
- **Toolkit:** pick a skill group, then a skill, to see the case studies that actually use it.
- **Journey:** a timeline of education, projects and what's next.
- **Live from GitHub:** profile stats, most-used languages, recent repositories and a contribution heatmap (yearly total, active days, streaks), pulled from GitHub automatically.

### Pages
| Route | What it does |
| --- | --- |
| `/projects` | All case studies as a list or a gallery, with search (by name or technology) and category filters |
| `/projects/[slug]` | Case study: role, status, screenshots, problem and outcome, key features, write-up with flowcharts, links |
| `/resume` | One-page résumé generated from the site's content. **Save as PDF** prints a clean A4 copy |
| `/blog`, `/blog/[slug]` | Articles with tags, reading time, table of contents and copyable code blocks |
| `/rss`, `/feed.xml` | How to subscribe, and the RSS 2.0 feed (with Feedly branding) |
| `/now`, `/about`, `/contact` | Editable pages. `/contact` has a contact form and an optional booking link |
| `/admin` | Private admin panel (see below) |

### Across the site
- **AI assistant** ("Ask my AI"): answers questions about my skills, projects and availability using Google Gemini, grounded in the site's own content. Without an API key it runs in demo mode.
- **Command palette:** press `⌘K`, `Ctrl+K` or `/` to jump to any page, project or post, switch theme or copy my email.
- **Follow on Feedly** buttons on the blog and every post.
- **Polish:** light and dark themes, page transitions (project screenshots morph into the case study), scroll-reveal animations, a reading-progress bar, a back-to-top button, a cursor spotlight on cards and my local time (IST) in the footer. All motion respects *reduce motion* settings.
- **SEO and sharing:** generated Open Graph images for the home page, each project and each post; JSON-LD structured data (Person, BlogPosting); sitemap and robots.txt.

### Admin panel (`/admin`)
- **Projects:** create, edit, reorder (display order) and delete case studies; upload images; import a repository from GitHub.
- **Posts and pages:** Markdown editor with live preview and a one-click flowchart template.
- **Inbox:** messages sent through the contact form.
- **Settings:** email, LinkedIn, X, booking link, location, résumé PDF link, GitHub username, availability and the highlight cards under the hero.

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, `proxy.ts`), React 19, TypeScript |
| Styling | Hand-written CSS with design tokens (no UI framework); Newsreader and Poppins via `next/font` |
| Validation and auth | Zod, `jose` (signed JWT sessions), `bcryptjs` |
| Storage | JSON files, a private Vercel Blob store, or MongoDB (see below) |
| AI | Google Gemini (Interactions API) |
| Images | `next/og` for generated share images |
| Icons | `lucide-react` |
| Hosting | Vercel |

---

## Project structure

```
app/
  (site)/              public pages: home, projects, blog, resume, now, about, contact, rss
    template.tsx       page transitions
  admin/               admin login and dashboard
  api/                 admin APIs, contact form, AI assistant
  feed.xml/            RSS feed
  opengraph-image.tsx  default share image (projects and posts have their own)
components/
  site/                header, footer, command palette, assistant, toolkit, GitHub section…
  admin/               admin panels
  FlowDiagram.tsx      flowchart renderer
lib/
  data.ts              profile, skills, journey and starter content
  store.ts             content storage (files / Vercel Blob / MongoDB)
  auth.ts              admin sessions
  github.ts            GitHub stats and contribution calendar
  markdown.tsx         Markdown → React renderer
  og.tsx               share-image renderer
public/                portrait, project screenshots and logos
assets/fonts/          fonts used by the share images
```

---

## Run locally

Requires **Node.js 20.9 or newer**.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000 · admin: /admin/login
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

---

## Environment variables

Only the first three are needed to sign in to the admin panel. Everything else is optional.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_EMAIL` | Yes | Admin sign-in email |
| `ADMIN_PASSWORD` | Yes | Admin password, plain text or a bcrypt hash (see below) |
| `AUTH_SECRET` | Yes | At least 32 random characters for signing sessions. In production, admin sign-in stays disabled until it is set |
| `NEXT_PUBLIC_SITE_URL` | In production | Live URL, used in the RSS feed, sitemap, résumé and share images |
| `BLOB_READ_WRITE_TOKEN` | For live edits on Vercel | Added automatically when you connect a Vercel Blob store |
| `CONTENT_STORE` | No | Force `file` or `blob` storage |
| `MONGODB_URI`, `MONGODB_DB` | No | Use MongoDB instead (takes priority over everything else) |
| `GITHUB_USERNAME` | No | GitHub account for the stats section (can also be set in Admin → Settings) |
| `GITHUB_TOKEN` | No | Personal access token with no scopes; raises the GitHub API limit from 60 to 5,000 requests an hour |
| `GEMINI_API_KEY` | No | Turns on the live AI assistant |
| `GEMINI_MODEL` | No | Gemini model (default `gemini-4-hydrogen`) |

Never commit `.env.local`. It is git-ignored and excluded from Vercel uploads by `.vercelignore`.

---

## Where content is stored

The site picks a storage mode automatically:

| Mode | When | Where |
| --- | --- | --- |
| **MongoDB** | `MONGODB_URI` is set | `projects`, `posts`, `settings` and `contacts` collections, seeded with the starter content on first run |
| **Vercel Blob** | Running on Vercel with a Blob store connected | Private blobs `cms/content.json` and `cms/inbox.json`, so admin edits and messages persist across deploys |
| **Files** (default) | Otherwise, e.g. locally | `data/content.json` for content; `data/inbox.json` for messages (git-ignored) |

Local and live content are separate. Edits made in the live admin panel stay on the live site, and editing `lib/data.ts` only changes the starter content (used until the first save).

---

## Writing flowcharts

Write architecture diagrams as plain text inside any project or post. They render as SVG.

````
```flow
title: High-level flow
lanes: 01 / User | 02 / Web app | 03 / Database
user: User / browser @1 input
app: Web app / Next.js @2
db: MongoDB / data @3 store
user -> app: request
app ..> db: save
```
````

- **Nodes:** `id: Title / subtitle @lane[.row] [input|store|accent]`
- **Arrows:** `->` main flow, `..>` async (dashed), `~>` data flow

---

## Personalize

- **`lib/data.ts`:** name, education, summary, skills, journey timeline and the starter projects, posts and pages.
- **Admin → Settings:** contact links, booking link, location, availability, GitHub username and highlight cards. Add a résumé PDF link to show an "Original PDF" button on `/resume`.
- **Admin → Pages:** the Now, About and Contact pages.
- **`public/profile.jpg`:** portrait used in the hero, About page and share image.
- **`public/projects/<slug>/`:** `cover.jpg`, extra screenshots and an optional `logo.png` / `logo.svg` for each project.

### Admin password

Generate a strong secret with `openssl rand -base64 48`. To store a bcrypt hash instead of a plain password:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-long-password', 12))"
```

---

## Deploy to Vercel

1. Import the repository in Vercel, or deploy from your machine with `npx vercel deploy --prod`.
2. Add the environment variables above. At minimum: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL`.
3. In **Storage**, create a **Blob** store (private) and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`, so the admin panel and contact form can save on the live site.
4. Optional: add `GEMINI_API_KEY` for the AI assistant and `GITHUB_TOKEN` for a higher GitHub API limit.
5. Run `npm run build` locally first to catch errors.

---

## Security

- Admin sessions are signed JWTs in an `HttpOnly`, `SameSite=Strict` cookie (also `Secure` in production) that expires after 8 hours. Admin APIs reject cross-site requests.
- Rate limits per IP: 5 sign-in attempts per 15 minutes, 8 assistant questions per minute and 5 contact messages per hour.
- All input is validated with Zod. Markdown is rendered to React elements, never raw HTML, and SVG uploads are not accepted.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are added to every response in `proxy.ts`.
- Rate limits are kept in memory per server instance. Before heavy traffic, add a shared rate limiter and a CAPTCHA on the contact form.
