# Vishwanath Thakur — Portfolio

Personal portfolio built with **Next.js 16 (App Router, Turbopack), React 19 and TypeScript**. Projects are written up as case studies with architecture flowcharts, there's a blog with an RSS feed, and a private admin panel manages projects, posts, pages, messages and site settings.

## Features

**Public site**
- **Design:** off-white grid-paper background, Newsreader serif headings, Poppins body text and an orange accent, with light and dark modes.
- **Home:** hero with photo, highlight cards, "What I'm building", selected case studies, latest writing, live GitHub stats and cross-links.
- **`/projects`:** case-study list or gallery view. Each project page has a breadcrumb, status, problem and outcome, key features, the write-up and links.
- **Flowcharts:** architecture diagrams are written as plain-text ` ```flow ` blocks inside Markdown and drawn as SVG. See *Writing flowcharts* below.
- **`/blog`:** tag filters and search. **`/rss`** explains how to subscribe, and **`/feed.xml`** is the RSS 2.0 feed.
- **`/now`, `/about`, `/contact`:** editable pages. `/contact` has separate guidance for different visitors and a contact form.
- **Extras:** booking pop-up ("Schedule a call"), ⌘K command palette, AI assistant (Gemini, or demo mode without a key), sitemap, robots and Open Graph tags.

**Admin panel** (`/admin`)
- **Content:** projects (with GitHub import and image uploads), blog posts, pages, the contact inbox and settings (links, booking URL, highlight cards).
- **Editors:** Markdown with live preview, plus a one-click flowchart template.

## Writing flowcharts

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
- **Arrows:** `->` primary flow, `..>` async (dashed), `~>` data flow

## Run locally

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000  ·  admin: /admin/login
```

Requires Node.js 20.9 or newer.


You only need `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `AUTH_SECRET` to sign in to the admin panel. Everything else is optional.

## Connect GitHub

Use **either** of these:
- Admin → Settings → GitHub username → *Test connection* → Save, **or**
- `GITHUB_USERNAME=your-username` in `.env.local`.

This turns on the "Live from GitHub" section on the home page and fills in the username for project imports. You can add a `GITHUB_TOKEN` (a personal access token with no scopes) to raise the API rate limit.

## Where content is stored

| Mode | When | Location |
| --- | --- | --- |
| Files (default) | `MONGODB_URI` is empty | `data/content.json` holds projects, posts and settings; `data/inbox.json` holds messages (git-ignored) |
| MongoDB | `MONGODB_URI` is set | `projects`, `posts`, `settings` and `contacts` collections, filled with the starter content on first run |

In file mode you edit content locally in `/admin`, then commit `data/content.json` so it deploys with the code. Hosts like Vercel have a read-only filesystem, so to edit content **on the live site**, set `MONGODB_URI`.

## Personalize

- `lib/data.ts`: name, education, summary, skills and journey timeline, plus the starter projects, posts and pages (used only until the first save).
- Admin → Settings: email, LinkedIn, X, booking link, location, résumé link, GitHub username and highlight cards.
- Admin → Pages: your Now, About and Contact pages.
- Add `public/resume.pdf`. The résumé button only appears once the file exists.
- Replace the starter project write-ups and blog posts with your own, and add real screenshots and links.

## Admin password

Generate a strong secret with `openssl rand -base64 48`. To store a bcrypt hash instead of a plain password:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-long-password', 12))"
```

## Security notes

- Admin sessions use a signed JWT in an HttpOnly, `SameSite=Strict` cookie that expires after 8 hours. Admin APIs also reject cross-site requests.
- All input is validated with Zod. Markdown is rendered to React elements, never raw HTML, and SVG uploads are not accepted.
- The contact form allows 5 messages per IP per hour. Before heavy traffic, add a managed rate limiter and CAPTCHA.

## Deploy (Vercel)

1. Push to GitHub and import the repository in Vercel.
2. Add the environment variables from `.env.example`:
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `AUTH_SECRET` to sign in to `/admin`
   - `MONGODB_URI`: **required on Vercel for the contact form and admin edits**, because the Vercel filesystem is read-only
   - `NEXT_PUBLIC_SITE_URL`: your live domain, used in the RSS feed, sitemap and share previews
   - optional: `GITHUB_TOKEN` (higher GitHub API limit) and `GEMINI_API_KEY` (live AI assistant)
3. Run `npm run build` locally first to catch errors.
