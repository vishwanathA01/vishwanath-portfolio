import type { Page, PageKey, Post, Project, Settings } from "./types";

/**
 * Personal details. Anything in `defaultSettings` can also be changed later
 * from the admin panel (Admin → Settings) without touching code.
 */
export const profile = {
  name: "Vishwanath Thakur",
  firstName: "Vishwanath",
  initials: "VT",
  tagline: "Learning by building.",
  role: "Computer Science Engineering Student · Full-Stack Developer",
  shortRole: "CSE Student · Full-Stack Developer",
  headline: "Engineering ideas into products people can use.",
  summary:
    "I’m a third-year Computer Science engineering student who builds full-stack web products and practical AI tools — from the interface people touch to the systems behind it.",
  education: {
    degree: "B.Tech — Computer Science & Engineering",
    institution: "Manav Rachna International Institute of Research and Studies",
    year: "3rd year",
    period: "2024 — 2028 (expected)"
  },
  interests: ["Full-stack engineering", "AI-powered products", "Product design", "Algorithms"]
};

export const defaultSettings: Settings = {
  /** Your GitHub username. Powers the live GitHub section and project imports. Empty hides the section. */
  githubUsername: process.env.GITHUB_USERNAME || "vishwanathA01",
  email: "hello@vishwanath.dev",
  linkedin: "",
  twitter: "",
  /** A Calendly / Cal.com link. When set, “Schedule a call” buttons appear across the site. */
  booking: "",
  location: "India",
  resume: "/resume.pdf",
  available: true,
  /** Proof cards under the hero. Edit them in Admin → Settings (e.g. hackathons, certifications, internships). */
  highlights: [
    { label: "Education", title: "B.Tech CSE · 3rd year", url: "/about" },
    { label: "Projects", title: "7 projects across AI, web & EdTech", url: "/projects" },
    { label: "Writing", title: "Notes on building & design", url: "/blog" },
    { label: "Right now", title: "Open to internships", url: "/now" }
  ]
};

export const skills = [
  { group: "Frontend", blurb: "Interfaces that feel fast, clear and accessible.", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML & CSS", "Tailwind CSS"] },
  { group: "Backend", blurb: "APIs, authentication and the logic behind the screen.", items: ["Node.js", "Python", "FastAPI", "PHP", "REST APIs", "Authentication"] },
  { group: "Data & Cloud", blurb: "Storing, shaping and shipping data reliably.", items: ["MongoDB", "MySQL", "Git & GitHub", "Vercel", "Figma"] },
  { group: "AI & Emerging", blurb: "Practical AI features that solve real problems.", items: ["Generative AI", "Gemini API", "Prompt Engineering", "API Integration"] },
  { group: "CS Foundations", blurb: "The fundamentals underneath everything I build.", items: ["Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks"] }
];

export const journey = [
  {
    period: "2024 — Present",
    title: "B.Tech, Computer Science & Engineering",
    place: "Manav Rachna International Institute of Research and Studies",
    text: "Currently in my third year, building strong foundations in data structures, algorithms, databases, operating systems and software engineering."
  },
  {
    period: "2025 — Present",
    title: "Independent & academic projects",
    place: "Self-directed",
    text: "Designing and shipping end-to-end projects across AI, education technology, creative coding and algorithmic systems — learning by building."
  },
  {
    period: "Next",
    title: "Open to internships & collaborations",
    place: "Remote or on-site",
    text: "Looking for teams where I can contribute to real products, learn from experienced engineers and keep raising the bar on craft."
  }
];

const seedTime = "2026-11-14T00:00:00.000Z";

export const seedProjects: Project[] = [
  {
    slug: "careerconnect-ai",
    name: "CareerConnect AI",
    tagline: "An AI co-pilot for exploring careers and strengthening applications.",
    category: "AI · Full-stack",
    year: "2026",
    status: "Featured",
    role: "Full-stack developer",
    description:
      "An AI-assisted career platform designed to help people explore roles, strengthen applications and navigate their next step.",
    problem: "Students often know which job they want but not how to get there — role requirements, résumé gaps and interview expectations are scattered and hard to act on.",
    outcome: "A guided flow that turns a student’s interests into concrete role paths, with specific, AI-generated suggestions to strengthen each application.",
    content:
      "## The constraint\nCareer advice for students is usually generic. Job descriptions are written for experienced hires, résumé tips ignore the specific role, and nothing connects *what a student is interested in* to *what a role actually asks for*. Any tool here has to work with incomplete input — a few interests, a rough résumé — and still say something specific.\n\n## What I built\nA Next.js front end with a separate FastAPI service that owns every AI call, so prompts, context and validation live in one place.\n\n- **Structured input first.** Interests, skills and résumé text are turned into a structured profile before any prompt is built.\n- **Prompt templates, not free chat.** Each feature (role paths, résumé feedback, interview prep) has its own template with explicit constraints.\n- **Structured output.** The model returns JSON that the API validates before anything reaches the UI, so answers render as clear next steps.\n\n```flow\ntitle: High-level flow — from a student’s interests to concrete next steps.\nlanes: 01 / Student | 02 / Next.js app | 03 / FastAPI service | 04 / AI model | 05 / Guidance\nprofile: Student profile / interests, skills @1 input\nresume: Résumé text / pasted or uploaded @1.2 input\nui: Career dashboard / Next.js · SSR @2\napi: Prompt builder / templates + context @3\nllm: Generative model / structured output @4 accent\ncheck: Schema check / validated JSON @4.2\npaths: Role paths / matched to interests @5\ntips: Résumé feedback / specific suggestions @5.2\nprofile -> ui: profile\nresume -> ui: résumé\nui -> api: request\napi -> llm: prompt\nllm ..> check: JSON\ncheck -> paths: ranked roles\ncheck -> tips: suggestions\n```\n\n## What was hard\n- **Generic answers.** Early prompts produced advice that could apply to anyone. Adding the structured profile and role-specific constraints made suggestions concrete.\n- **Unreliable formatting.** Free-text responses were hard to display. Asking for JSON and validating it on the server fixed broken layouts.\n- **Thin input.** With very little information, the honest output is to ask for more — not to invent detail.\n\n## What I’d do differently\nAdd evaluation from the start: a small set of sample profiles with expected suggestions, so prompt changes can be checked instead of eyeballed.",
    features: ["Role exploration based on interests and skills", "AI feedback on résumé and application text", "Interview preparation prompts", "Clean, accessible dashboard UI"],
    stack: ["Next.js", "FastAPI", "Python", "Generative AI"],
    link: "",
    github: "",
    image: "",
    gallery: [],
    motif: "network",
    featured: true,
    order: 1,
    updatedAt: seedTime
  },
  {
    slug: "skillorbit",
    name: "SkillOrbit",
    tagline: "Discover skills, build careers — AI career intelligence and job matching.",
    category: "AI · Full-stack",
    year: "2026",
    status: "Live",
    role: "Full-stack developer",
    description: "A career intelligence platform that compares a learner’s skills with 26 tech, business and creative careers, shows exactly what to learn next and matches them with real jobs posted today.",
    problem: "Students and career switchers don’t know which career fits them, which skills they are missing, or which open roles they could realistically apply for today.",
    outcome: "A single platform that scores career fit, shows skill gaps with learning paths, and matches people with live jobs — backed by an explainable ML service and a Gemini-powered career guide.",
    content:
      "## The constraint\nCareer advice for students is usually generic. Learners can’t easily see which careers fit their skills, what they still need to learn, or which real jobs they could apply for today — and that information is scattered across job boards, courses and forums.\n\n## What I built\nA full-stack platform with a React + TypeScript front end, an Express API on MongoDB, and a Python FastAPI service for matching.\n\n- **Explore careers.** 26 careers across tech, business and creative fields with pay bands, demand, open roles and a one-minute match quiz.\n- **Jobs.** SkillOrbit roles plus live listings from public job boards, with explainable match scores.\n- **AI Career Lab.** A readiness score for a target career, a skill radar and skill-gap analysis that feeds learning recommendations.\n- **Learning paths.** 18 paths with progress, streaks, a study planner and AI knowledge checks.\n- **Projects & community.** Upload or import projects from GitHub for code insights, plus a members-only community and private messages.\n\n```flow\ntitle: High-level flow — from a learner’s skills to matched careers and jobs.\nlanes: 01 / Learner | 02 / React + TS app | 03 / Express API | 04 / AI services | 05 / Data\nlearner: Learner / student, switcher @1 input\napp: SkillOrbit app / explore, jobs, lab @2\napi: Express API / auth, profiles, jobs @3\nml: FastAPI ML service / matching, skill gaps @4 accent\ngemini: Gemini / career guide, quizzes @4.2 accent\ndb: MongoDB / users, projects, jobs @5 store\nboards: Job boards / live listings @5.2 input\nlearner -> app: browse\napp -> api: REST\napi -> ml: match request\napi -> gemini: prompts\nml ..> db: scores\nboards ~> api: live jobs\n```\n\n## What was hard\n- **Explainable matching.** A score alone doesn’t help; showing which skills drive a match makes it actionable.\n- **Account security.** Two-step sign-in with emailed codes, verification and sign-in history without making sign-in painful.\n\n## What I’d do differently\nAdd more evaluation for match quality, with sample profiles and expected results, so model changes can be measured.",
    features: ["Explore 26 careers with pay bands, demand and time to learn", "Live jobs from SkillOrbit employers and public job boards", "AI Career Lab: readiness score, skill radar and skill-gap analysis", "18 learning paths with progress, streaks and a study planner", "Project portfolio with GitHub import and code insights", "Community, private messages and two-step secure sign-in"],
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python", "FastAPI", "Gemini API"],
    link: "https://skillorbit-navy.vercel.app",
    github: "",
    image: "/projects/skillorbit/cover.jpg",
    gallery: ["/projects/skillorbit/1.jpg", "/projects/skillorbit/2.jpg", "/projects/skillorbit/3.jpg"],
    motif: "radial",
    featured: true,
    order: 2,
    updatedAt: seedTime
  },
  {
    slug: "edunexa",
    name: "EduNexa",
    tagline: "Learn, grow, succeed — a learning platform with lessons, live classes and research tools.",
    category: "EdTech · Full-stack",
    year: "2026",
    status: "Featured",
    role: "Full-stack developer",
    description: "A PHP and MySQL learning management system with video lessons, quizzes and certificates, live classrooms, a research hub, community discussions and direct messaging for students, teachers and admins.",
    problem: "Students juggle separate tools for lectures, assignments, research and doubt-solving, and teachers lack one place to teach live and track progress.",
    outcome: "One platform where courses, quizzes, certificates, live classes, research resources and messaging live together, with dashboards for students, teachers and admins.",
    content:
      "## The constraint\nOnline learning is usually split across many tools: videos in one place, quizzes in another, live classes in a third and research somewhere else. Students lose track, and teachers have no single view of how a class is doing.\n\n## What I built\nA PHP and MySQL learning platform with separate experiences for students, teachers and admins.\n\n- **Lessons.** YouTube links (watch, youtu.be, Shorts or embeds) become an in-platform player.\n- **Assessment.** Quizzes, progress tracking and completion certificates.\n- **Live classrooms.** Teachers create sessions; students and teachers join the same Jitsi Meet room with chat and attendance.\n- **Research Hub.** Google Scholar searches, saved papers and a PDF reader.\n- **Community.** Discussions with comments and likes, plus direct messages between students, teachers and admins.\n\n```flow\ntitle: High-level flow — one platform for learning, teaching and research.\nlanes: 01 / Users | 02 / PHP app | 03 / MySQL | 04 / Integrations\nstudent: Student / courses, quizzes @1 input\nteacher: Teacher / lessons, live class @1.2 input\nlms: Courses & lessons / YouTube player @2\nlive: Live classroom / sessions, attendance @2.2\ndb: MySQL / courses, quizzes, messages @3 store\njitsi: Jitsi Meet / video, chat @4 accent\nscholar: Google Scholar / research hub @4.2 input\nstudent -> lms: learn\nteacher -> live: start class\nlms ..> db: progress\nlive ..> db: attendance\nlive -> jitsi: room link\nlms ~> scholar: research\n```\n\n## What was hard\n- **Schema design.** Courses, lessons, quizzes, results, messages and live sessions all connect to the same users without becoming tangled.\n- **Permissions.** Every action checks the user’s role on the server, not just in the interface.\n\n## What I’d do differently\nMove live classes to a self-hosted Jitsi deployment and add automated tests for the core flows.",
    features: ["Courses with an in-platform YouTube lesson player", "Quizzes, progress tracking and certificates", "Live classrooms with Jitsi Meet video, chat and attendance", "Research Hub with Google Scholar search and saved papers", "Community discussions and direct messaging", "Student library, wishlist, ratings and notifications"],
    stack: ["PHP", "MySQL", "JavaScript", "Jitsi Meet", "HTML & CSS"],
    link: "",
    github: "",
    image: "/projects/edunexa/cover.jpg",
    gallery: [],
    motif: "grid",
    featured: true,
    order: 3,
    updatedAt: seedTime
  },
  {
    slug: "gofoode",
    name: "GoFoode",
    tagline: "Multi-restaurant food ordering and delivery with four role-based portals.",
    category: "Web · Full-stack",
    year: "2026",
    status: "Live",
    role: "Full-stack developer",
    description: "A MERN-stack food ordering and delivery platform: customers browse local kitchens, order and follow their rider live, while restaurant owners, delivery partners and a super admin each get their own portal.",
    problem: "Small local restaurants often take orders over phone calls and messages, which leads to missed orders, no clear status for customers and no easy way to keep menus up to date.",
    outcome: "An end-to-end ordering platform — menus, cart, checkout and live order tracking — with dedicated portals for restaurant owners, delivery partners and administrators.",
    content:
      "## The constraint\nFor a small restaurant, an order that arrives as a phone call or a message is easy to lose and impossible to track. A delivery platform has to serve several very different people at once: hungry customers, busy kitchen staff, riders on the road and the team running the platform.\n\n## What I built\nA MERN-stack platform with four role-based portals sharing one API.\n\n- **Customer app.** Browse local kitchens and dishes, filter menus, apply offers, check out and follow the rider live on the map.\n- **Restaurant owner portal.** Manage menus, availability and incoming orders.\n- **Delivery partner portal.** Accept deliveries and update their status on the way.\n- **Super admin.** Oversee restaurants, users, offers and platform analytics.\n- **Real time.** Socket.IO pushes order and rider updates instantly instead of polling.\n\n```flow\ntitle: High-level flow — from menu to doorstep.\nlanes: 01 / Customer | 02 / React app | 03 / Express API | 04 / MongoDB | 05 / Partners\ncustomer: Customer / browse & order @1 input\ncart: Menu & cart / React + Vite @2\ntracker: Live tracker / rider on the map @2.2\napi: Orders API / JWT, validation @3\nsocket: Socket.IO / live updates @3.2\norders: Orders / Mongoose models @4 store\npartner: Restaurant & rider / portals @5 accent\ncustomer -> cart: add items\ncart -> api: place order\napi ..> orders: save\norders -> partner: new order\npartner ~> socket: status update\nsocket -> tracker: notify\n```\n\n## What was hard\n- **Trusting the server, not the client.** Prices and totals are recalculated on the API, so a modified request can’t change what an order costs.\n- **Four roles, one API.** Every route and endpoint is protected by role so each portal only sees what it should.\n\n## What I’d do differently\nIntegrate a live payment gateway and add automatic rider assignment based on distance.",
    features: ["Four portals: customer, restaurant owner, delivery partner and super admin", "Restaurant pages with menus, offers, veg-only filter and cart", "Food delivery, Instamart groceries, Dineout and pickup & drop", "Live order and rider tracking with Socket.IO", "Offers, coupon codes and rewards", "Analytics dashboards with Recharts"],
    stack: ["React", "Vite", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT"],
    link: "https://gofoode.vercel.app",
    github: "",
    image: "/projects/gofoode/cover.jpg",
    gallery: ["/projects/gofoode/1.jpg", "/projects/gofoode/2.jpg", "/projects/gofoode/3.jpg"],
    motif: "grid",
    featured: true,
    order: 4,
    updatedAt: seedTime
  },
  {
    slug: "ironx",
    name: "IRONX",
    tagline: "Gym management for members, trainers and admins — built with PHP and MySQL.",
    category: "Web · Management",
    year: "2026",
    status: "Featured",
    role: "Full-stack developer",
    description: "A modular gym management application with public pages and separate member, trainer and admin areas covering memberships, workout and diet planning, attendance, bookings and progress tracking.",
    problem: "Gyms often run memberships, attendance, workout plans and bookings across paper registers and spreadsheets, so renewals get missed and members can’t see their own progress.",
    outcome: "One application where members book sessions and track progress, trainers build workout and diet plans, and admins manage memberships and attendance.",
    content:
      "## The constraint\nDay-to-day gym operations — memberships, renewals, attendance, bookings and training plans — are often spread across registers and spreadsheets. Staff repeat the same tasks all day, and members have no view of their own progress.\n\n## What I built\nA modular PHP 8 and MySQL application using PDO, with public pages and three role-based areas.\n\n- **Members** book sessions, follow their workout and diet plans and track progress.\n- **Trainers** create workout and diet plans and manage their clients.\n- **Admins** manage memberships, attendance, booking requests and user roles.\n- **Security first.** Public registration only creates member accounts; roles are promoted by an administrator, and password resets use hashed one-time tokens.\n- **Ready to extend.** An AI assistant and payment gateway are built as clear integration points for future work.\n\n```flow\ntitle: High-level flow — three roles, one gym database.\nlanes: 01 / Users | 02 / PHP app | 03 / MySQL | 04 / Extensions\nmember: Member / bookings, progress @1 input\ntrainer: Trainer / plans, clients @1.2 input\nareas: Role-based areas / sessions, PDO @2\nplans: Workout & diet / planning @2.2\ndb: MySQL / ironx_gym @3 store\nai: AI assistant / integration point @4 accent\nmember -> areas: sign in\ntrainer -> plans: create plans\nareas ..> db: records\nplans ..> db: save\nareas ~> ai: questions\n```\n\n## What was hard\n- **Role design.** Keeping member, trainer and admin permissions separate meant checking roles on the server for every action, not just hiding links.\n- **Clean data model.** Memberships, attendance, bookings and plans all relate to the same members without duplicating data.\n\n## What I’d do differently\nFinish the payment gateway and email reminders, and add QR-code attendance.",
    features: ["Member, trainer and admin areas with role-based access", "Membership records and renewal tracking", "Workout and diet planning by trainers", "Attendance logging and booking requests", "Member progress tracking", "Secure password reset with hashed one-time tokens"],
    stack: ["PHP", "MySQL", "PDO", "JavaScript", "HTML & CSS"],
    link: "",
    github: "",
    image: "/projects/ironx/cover.jpg",
    gallery: [],
    motif: "bars",
    featured: true,
    order: 5,
    updatedAt: seedTime
  },
  {
    slug: "rangsutra",
    name: "RangSutra",
    tagline: "A digital rangoli studio with radial symmetry, powder textures and tradition presets.",
    category: "Creative technology",
    year: "2026",
    status: "Live",
    role: "Full-stack developer",
    description: "A premium, Indian-art themed studio for designing rangoli in the browser — radial symmetry up to 24-fold, sifted-powder textures, petal and paisley motifs, layers and a personal gallery, built with Flask and vanilla JavaScript.",
    problem: "Rangoli’s intricate radial symmetry is slow to sketch digitally: ordinary drawing tools make you repeat every stroke by hand around a centre point.",
    outcome: "A studio where each stroke is mirrored up to 24 times, with traditional motifs, festival palettes and eight tradition presets — and designs that can be saved, reopened and exported.",
    content:
      "## The constraint\nRangoli and kolam are built from repeated motifs arranged with precise radial symmetry. Drawing one digitally with a normal paint tool means repeating every curve by hand — slow, and never quite symmetric.\n\n## What I built\nA browser studio with a Flask backend and a vanilla JavaScript front end (no build step).\n\n- **Symmetry engine.** Every stroke is rotated into 4 to 24 segments, with an optional mirror for kaleidoscope patterns; motif stamps always face outward from the centre.\n- **Real materials.** Sifted-powder and glow brush textures, festival palettes and canvas surfaces give the look of floor art.\n- **Serious editing.** Up to 8 layers, 30-step undo/redo, zoom, pan, focus mode and keyboard shortcuts.\n- **Traditions & gallery.** Eight hand-built presets (Kolam, Pookalam, Alpana, Mandana, Peacock…), a seeded generator, and a gallery to save, reopen and export designs.\n\n```flow\ntitle: High-level flow — one stroke in, a symmetric design out.\nlanes: 01 / Input | 02 / Symmetry engine | 03 / Canvas & layers | 04 / Storage & export\nstroke: Pointer stroke / brush, petal, paisley @1 input\npreset: Tradition preset / 8 presets @1.2 input\nmirror: Rotate & mirror / up to 24-fold @2\nlayers: Layers / 8 layers, undo @3\ndraft: Autosave / IndexedDB @3.2 store\napi: Flask API / gallery storage @4 store\npng: Export / PNG, HD, JPG @4.2\nstroke -> mirror: points\npreset -> mirror: motifs\nmirror -> layers: N copies\nlayers ..> draft: autosave\nlayers -> api: save design\nlayers -> png: export\n```\n\n## What was hard\n- **Natural strokes.** Raw pointer input is jagged; smoothing points before rendering made lines feel hand-drawn.\n- **Performance.** Drawing many mirrored copies per stroke, across layers, needs careful redraws to stay responsive.\n\n## What I’d do differently\nAdd a public gallery so people can share and remix each other’s designs.",
    features: ["12 tools: brush, ring, petal, flower, paisley, fill and more", "Radial symmetry up to 24-fold plus mirror/kaleidoscope mode", "Powder and glow brush textures with festival colour palettes", "8 layers, 30-step undo/redo, zoom and pan", "8 tradition presets (Kolam, Pookalam, Alpana, Peacock…) and a “Surprise me” generator", "Gallery with search and favourites; export PNG, HD PNG and JPG"],
    stack: ["Python", "Flask", "JavaScript", "HTML Canvas", "IndexedDB"],
    link: "https://rangsutra-topaz.vercel.app",
    github: "",
    image: "/projects/rangsutra/cover.jpg",
    gallery: ["/projects/rangsutra/1.jpg", "/projects/rangsutra/2.jpg", "/projects/rangsutra/3.jpg"],
    motif: "radial",
    featured: false,
    order: 6,
    updatedAt: seedTime
  },
  {
    slug: "flowgrid",
    name: "FlowGrid",
    tagline: "Optimizing every road — an intelligent traffic management platform.",
    category: "Algorithms · Full-stack",
    year: "2026",
    status: "Live",
    role: "Full-stack developer",
    description: "A smart-city traffic platform that models a city as a weighted graph and puts proven algorithms to work: A* and Dijkstra routing, Webster signal timing and Holt-Winters demand forecasting, all in a live control center.",
    problem: "City traffic changes hour by hour, but fixed signal timings and simple shortest-path routing ignore congestion — so one busy junction can slow an entire corridor.",
    outcome: "A live control center where routes, signal plans and demand forecasts react to simulated traffic — with algorithm benchmarks to compare strategies side by side.",
    content:
      "## The constraint\nTraffic in a city is not static: demand peaks in the morning and evening, incidents close roads, and a single overloaded junction can ripple across a whole corridor. Fixed signal timings and naive shortest-path routing ignore all of that.\n\n## What I built\nFlowGrid models a demo city — 18 intersections and 34 road links — as a weighted graph and runs a traffic simulation over it, served by a Flask backend.\n\n- **Control Center.** A live network map coloured by congestion, with active vehicles, average speed, signal delay and incidents.\n- **Route Planner.** Pick two junctions and compare A*, Dijkstra, Bellman–Ford and BFS, optimising for live traffic, free flow or distance — including alternatives and an emergency green corridor.\n- **Signal Optimizer.** Webster’s method turns predicted flows into signal timing plans.\n- **Simulation & analytics.** A simulation lab, Holt-Winters demand forecasting and benchmarks that compare algorithms on the same network.\n\n```flow\ntitle: High-level flow — from a city model to live routes and signal plans.\nlanes: 01 / City model | 02 / Flask engine | 03 / Algorithms | 04 / Control Center\ngraph: City graph / 18 junctions, 34 roads @1 store\nsim: Traffic simulator / demand by time of day @1.2 input\napi: Flask API / routing & signals @2\nforecast: Holt-Winters / demand forecast @2.2\nroute: Route solvers / A*, Dijkstra, BF, BFS @3\nwebster: Webster timing / signal plans @3.2\nui: Control Center / live map, KPIs @4 accent\nplanner: Route Planner / alternatives, corridor @4.2\ngraph -> api: load network\nsim ..> forecast: history\napi -> route: shortest path\nforecast -> webster: predicted flow\nroute -> planner: routes\nwebster -> ui: timings\n```\n\n## What was hard\n- **Fair comparisons.** Benchmarking algorithms only means something when every solver runs on the same network snapshot.\n- **Believable traffic.** Demand has to rise and fall through the day for routing and signal plans to behave realistically.\n\n## What I’d do differently\nImport real road networks from OpenStreetMap and feed in live sensor data instead of a synthetic city.",
    features: ["Control Center with a live network map, congestion index and incidents", "Route Planner with A*, Dijkstra, Bellman–Ford and BFS", "Emergency green corridor to the nearest hospital", "Signal Optimizer using Webster timing", "Simulation Lab and Holt-Winters demand forecasting", "Algorithm Analytics benchmarks and a documented REST API"],
    stack: ["Python", "Flask", "JavaScript", "Graph algorithms", "Vercel"],
    link: "https://flowgrid-self.vercel.app",
    github: "",
    image: "/projects/flowgrid/cover.jpg",
    gallery: ["/projects/flowgrid/1.jpg", "/projects/flowgrid/2.jpg", "/projects/flowgrid/3.jpg", "/projects/flowgrid/4.jpg"],
    motif: "flow",
    featured: false,
    order: 7,
    updatedAt: seedTime
  }
];

export const seedPosts: Post[] = [
  {
    slug: "how-this-portfolio-is-built",
    title: "How this portfolio is built",
    excerpt: "A case-study-first portfolio: Next.js, a tiny CMS, flow diagrams written as text, and a /now page.",
    tags: ["Next.js", "Portfolio"],
    cover: "",
    published: true,
    date: "2026-11-10",
    updatedAt: seedTime,
    content: "Most student portfolios are a grid of screenshots. I wanted mine to read more like a set of short engineering write-ups: what the problem was, what I built, what broke and what I’d change.\n\n## Case studies, not thumbnails\nEvery project has a problem and an outcome, a list of key features and a longer write-up. The projects page can switch between a case-study list and a gallery.\n\n## Diagrams written as text\nArchitecture diagrams are written in a few lines of plain text inside the write-up and drawn as SVG when the page renders. For example, this is the flow of the site itself:\n\n```flow\ntitle: How a page gets to you.\nlanes: 01 / Author | 02 / Admin panel | 03 / Storage | 04 / Next.js | 05 / Reader\nme: Me / writing @1 input\nadmin: Admin panel / Markdown editor @2\nstore: Content store / JSON or MongoDB @3 store\nnext: Next.js server / renders pages @4\nreader: Reader / browser @5\nme -> admin: write\nadmin ..> store: save\nstore -> next: read\nnext -> reader: HTML\n```\n\n## A small CMS\nProjects, posts and pages are edited in a private admin panel with live Markdown preview. Content is stored in a JSON file locally or in MongoDB in production.\n\n## Now, About, Contact\nA [/now page](/now) says what I’m focused on, [About](/about) has the longer story, and [Contact](/contact) explains how to reach me depending on what you need.\n\n> Write the problem down first. The design usually follows."
  },
  {
    slug: "securing-a-nextjs-admin-panel",
    title: "Securing a small Next.js admin panel",
    excerpt: "The practical choices behind this site’s private dashboard: HTTP-only sessions, hashed passwords, validation and rate limits.",
    tags: ["Security", "Next.js"],
    cover: "",
    published: true,
    date: "2026-11-04",
    updatedAt: seedTime,
    content:
      "This portfolio has a private admin panel for writing posts, managing projects and reading messages. Here is how it is protected.\n\n## Sessions\nAfter sign-in the server issues a signed **JWT** stored in an `HttpOnly`, `SameSite=Strict` cookie that expires after eight hours. JavaScript in the browser can’t read it, and other sites can’t send it.\n\n## Passwords\nThe admin password can be stored as a **bcrypt** hash, so even someone who reads the environment variables doesn’t learn the password itself.\n\n## Validation\nEvery request body is validated with **Zod** before it touches the database. Anything with the wrong shape is rejected with a generic error.\n\n## Rate limiting\nThe public contact form allows a handful of messages per IP address per hour, which stops casual spam without adding friction for real visitors.\n\n## Headers\nMiddleware adds `X-Frame-Options`, `X-Content-Type-Options`, a strict referrer policy and a permissions policy to every response.\n\n## What’s next\nA managed rate limiter and bot protection on the contact form would be the next upgrades before heavy traffic."
  },
  {
    slug: "from-github-repo-to-case-study",
    title: "From GitHub repo to case study",
    excerpt: "A repository shows code. A case study shows thinking. Here’s how this site turns one into the other.",
    tags: ["GitHub", "Workflow"],
    cover: "",
    published: true,
    date: "2026-10-28",
    updatedAt: seedTime,
    content:
      "A list of repositories tells a visitor what I’ve built. It doesn’t tell them *why* or *how*. So this portfolio treats GitHub as the starting point, not the finished page.\n\n## Import\nThe admin panel reads my public repositories from the GitHub API. Picking one fills in the project form with its name, description, language, topics, homepage and a preview image.\n\n## Edit\nFrom there I add what GitHub can’t know:\n\n1. A one-line tagline\n2. The problem the project solves\n3. Key features and architecture\n4. What I learned\n5. Screenshots\n\n## Publish\nThe project gets its own page with a cover image, gallery and a write-up, and the home page shows live GitHub stats alongside it.\n\nThe repository stays the source of truth for the code; the case study tells the story."
  }
];

export const seedPages: Record<PageKey, Page> = {
  now: {
    key: "now",
    title: "Now",
    intro: "What I’m focused on at the moment. This page is updated every few weeks — inspired by the /now page movement.",
    updatedAt: seedTime,
    content:
      "## Third year of B.Tech CSE\nCoursework this year centres on the fundamentals I use every day: data structures and algorithms, database systems, operating systems and computer networks.\n\n## Polishing my projects\nI’m turning my academic and personal projects into proper case studies — cleaning up code, writing documentation and adding the screenshots and write-ups you’ll find on the [projects page](/projects).\n\n## Writing more\nI’m publishing short articles on what I build and learn on the [blog](/blog). Writing forces me to understand things properly.\n\n## Looking for an internship\nI’m open to software-engineering internships — full-stack web, backend or applied AI. If your team is hiring, the [contact page](/contact) explains the best way to reach me."
  },
  about: {
    key: "about",
    title: "About",
    intro: "The longer version — where I’m coming from, how I work and what I’m trying to do.",
    updatedAt: seedTime,
    content:
      "## Where this starts\nI’m Vishwanath Thakur, a third-year Computer Science & Engineering student at Manav Rachna International Institute of Research and Studies. I got into programming because I liked the idea that a few lines of code could turn into something people actually use.\n\n## How I work\nI learn best by building. Each project on this site started as a question — *could a career platform give students more useful guidance? could a Rangoli be drawn with symmetry?* — and became a way to practise a new part of the stack.\n\n- I like owning a problem end to end, from the interface to the database\n- I keep things simple first, then make them better\n- I write things down, which is why this site has a blog\n\n## What I’m good at\nFull-stack web development with React, Next.js and Node.js; backend work in Python and PHP; databases like MongoDB and MySQL; and practical AI features using the Gemini API. Underneath that are the CS fundamentals from my degree.\n\n## What I’m trying to do\nGet better at building software that holds up in the real world — and find a team where I can contribute, learn from experienced engineers and ship things that matter."
  },
  contact: {
    key: "contact",
    title: "Contact",
    intro: "Different asks, different framing. Here’s how to reach me for whatever you have in mind.",
    updatedAt: seedTime,
    content:
      "## Recruiters & internship teams\nI’m looking for software-engineering internships in full-stack web, backend or applied AI. Share the role, the team and the timeline, and I’ll reply with my résumé and the projects most relevant to it.\n\n## Fellow students & collaborators\nHackathons, open-source contributions or a side project you’d like a teammate for — tell me the idea and what you’re hoping to build.\n\n## Freelance & small projects\nNeed a website, a dashboard or a small tool? Describe the problem, your deadline and any budget, and I’ll tell you honestly whether I’m a good fit."
  }
};
