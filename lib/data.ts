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
    tagline: "Pick a goal, follow a skill roadmap and track your progress.",
    category: "EdTech · Full-stack",
    year: "2026",
    status: "In progress",
    role: "Full-stack developer",
    description: "A skill-tracking and learning-roadmap app: choose a goal such as becoming a web developer, get a structured roadmap of skills, track your progress and find the right resources for every step.",
    problem: "Self-taught learners jump between random tutorials without knowing what to learn next, how far they’ve come, or which skills actually matter for their goal.",
    outcome: "A goal-based roadmap where every skill has resources and a status, and progress is visible at a glance — so learners always know their next step.",
    content:
      "## The constraint\nLearning to code on your own is mostly a navigation problem. There is no shortage of tutorials, but there is no map: learners don’t know which skills come first, which ones matter for their goal, or how much progress they have actually made. Bookmarks and to-do lists don’t capture prerequisites or progress.\n\n## What I built\nA full-stack app that turns a goal into a roadmap of skills — the “orbit” — and tracks each learner’s journey through it.\n\n- **Roadmaps as data.** Each roadmap is a set of skills with an order, prerequisites and linked resources, stored in MongoDB so new roadmaps can be added without code changes.\n- **Progress engine.** Marking a skill as done updates the learner’s completion percentage, milestones and streak on the server.\n- **Dashboard.** A visual roadmap shows what’s done, what’s in progress and what’s next, alongside stats.\n- **Authentication.** JWT-based sign-up and login, with every progress update tied to the signed-in user.\n\n```flow\ntitle: High-level flow — from a goal to a tracked roadmap.\nlanes: 01 / Learner | 02 / Next.js app | 03 / Express API | 04 / MongoDB\nlearner: Learner / picks a goal @1 input\nroadmap: Roadmap view / skills & next step @2\nprogress: Progress update / mark skill done @2.2\napi: REST API / auth, roadmaps @3\nengine: Progress engine / %, milestones, streak @3.2\nroadmaps: Roadmaps / skills, resources @4 store\nusers: User progress / per-skill status @4.2 store\nlearner -> roadmap: choose goal\nroadmap -> api: fetch roadmap\napi -> roadmaps: query\nlearner -> progress: complete skill\nprogress -> engine: update\nengine ..> users: save\n```\n\n## What was hard\n- **Modelling roadmaps.** Skills have prerequisites and optional branches, so a simple list wasn’t enough. Storing order and prerequisites explicitly kept the roadmap view and progress logic simple.\n- **Consistent progress.** When a roadmap changes, existing progress must still make sense. Progress is stored per skill ID rather than by position in the list.\n- **Keeping it motivating.** Completion percentages and streaks turned out to matter as much as the content itself.\n\n## What I’d do differently\nAdd personalised recommendations — suggesting the next skill and resources based on what the learner has completed — and let the community submit and rate resources.",
    features: ["Goal-based skill roadmaps (web developer, data analyst and more)", "Progress tracking for every skill and milestone", "Curated learning resources for each step", "Dashboard with completion stats and learning streaks", "Secure sign-up and login with protected routes"],
    stack: ["Next.js", "React", "Node.js", "Express", "MongoDB", "JWT"],
    link: "",
    github: "",
    image: "",
    gallery: [],
    motif: "radial",
    featured: true,
    order: 2,
    updatedAt: seedTime
  },
  {
    slug: "edunexa",
    name: "EduNexa",
    tagline: "Courses, assessments and community in one connected learning space.",
    category: "EdTech · Full-stack",
    year: "2026",
    status: "Featured",
    role: "Full-stack developer",
    description:
      "A learning platform concept bringing courses, assessments, community and teaching tools into one connected experience.",
    problem: "Students juggle separate tools for lectures, assignments and doubt-solving, and teachers lack one place to track progress.",
    outcome: "One platform where courses, auto-scored quizzes and progress tracking live together, with role-based dashboards for students and teachers.",
    content:
      "## The constraint\nStudents jump between separate tools for lectures, assignments and doubt-solving, and teachers have no single view of how a class is doing. The platform needed three very different roles — student, teacher, admin — sharing the same data without seeing each other’s controls.\n\n## What I built\nA PHP application on a MySQL schema designed around courses, modules, enrolments and results.\n\n- **Role-based access.** Session-based authentication with permissions checked on every request, not just hidden buttons.\n- **Course structure.** Courses contain modules and lessons; enrolments link students to courses.\n- **Assessments.** Quizzes are scored automatically and results feed straight into progress dashboards.\n\n```flow\ntitle: High-level flow — one data model, three roles.\nlanes: 01 / Users | 02 / PHP app | 03 / MySQL | 04 / Features\nstudent: Student / enrolled learner @1 input\nteacher: Teacher / course owner @1.2 input\nauth: Auth & roles / sessions, permissions @2\ncourses: Courses / modules, lessons @3 store\nresults: Quiz results / scores, attempts @3.2 store\nquiz: Quiz engine / auto-scoring @4\nprogress: Progress view / dashboards @4.2\nstudent -> auth: login\nteacher -> auth: login\nauth -> courses: role-based access\ncourses -> quiz: questions\nquiz ..> results: save score\nresults -> progress: progress data\n```\n\n## What was hard\n- **Schema design.** Getting enrolments, attempts and results into a shape that stays clean as features grow took several iterations.\n- **Permissions.** It’s easy to hide a button and forget the endpoint. Every action had to check the role on the server.\n\n## What I’d do differently\nIntroduce a lightweight framework or router earlier, and write migrations for the schema instead of editing tables by hand.",
    features: ["Course and module management", "Quizzes with automatic scoring", "Student progress tracking", "Role-based dashboards for students and teachers"],
    stack: ["PHP", "MySQL", "JavaScript", "HTML & CSS"],
    link: "",
    github: "",
    image: "",
    gallery: [],
    motif: "grid",
    featured: true,
    order: 3,
    updatedAt: seedTime
  },
  {
    slug: "gofoode",
    name: "GoFoode",
    tagline: "Browse restaurants, build a cart, place an order and track it to your door.",
    category: "Web · Full-stack",
    year: "2026",
    status: "Featured",
    role: "Full-stack developer",
    description: "A food ordering and delivery web app: browse restaurants and menus, add dishes to a cart, place an order and follow its status in real time, with a dashboard for restaurants to manage menus and incoming orders.",
    problem: "Small local restaurants often take orders over phone calls and messages, which leads to missed orders, no clear status for customers and no easy way to keep menus up to date.",
    outcome: "An end-to-end ordering flow — menu, cart, order and status updates — plus a restaurant dashboard to manage menus and move every order through each stage.",
    content:
      "## The constraint\nFor a small restaurant, an order that arrives as a phone call or a message is easy to lose and impossible to track. Customers don’t know whether their food is being prepared, and menus with sold-out items are hard to keep current. The app needed to work for two audiences at once: hungry customers and busy restaurant staff.\n\n## What I built\nA MERN-stack ordering platform with separate customer and restaurant experiences sharing one API.\n\n- **Browsing & cart.** Customers search restaurants, filter by cuisine and add dishes to a cart that keeps quantities and totals in sync.\n- **Orders API.** The server validates every order, recalculates prices from the database (never trusting the client) and stores it with a status.\n- **Status pipeline.** Each order moves through placed → preparing → out for delivery → delivered, and the customer’s tracker updates as the restaurant advances it.\n- **Restaurant dashboard.** Staff manage menu items and availability, and work through incoming orders in one place.\n\n```flow\ntitle: High-level flow — from menu to doorstep.\nlanes: 01 / Customer | 02 / React app | 03 / Express API | 04 / MongoDB | 05 / Restaurant\ncustomer: Customer / browse & order @1 input\ncart: Menu & cart / React state @2\ntracker: Order tracker / status timeline @2.2\napi: Orders API / validate, price @3\nstatus: Status service / placed → delivered @3.2\norders: Orders / items, totals @4 store\ndashboard: Restaurant dashboard / accept, prepare @5 accent\ncustomer -> cart: add items\ncart -> api: place order\napi ..> orders: save\norders -> dashboard: new order\ndashboard ~> status: update status\nstatus -> tracker: notify\n```\n\n## What was hard\n- **Trusting the server, not the client.** Prices and totals are recalculated on the API from the menu in the database, so a modified request can’t change what an order costs.\n- **Cart state.** Keeping quantities, totals and item availability consistent across pages needed a single source of truth in the front end.\n- **Two user types.** Customers and restaurants see very different screens, so routes and API endpoints are protected by role.\n\n## What I’d do differently\nIntegrate a payment gateway, push real-time status updates over WebSockets instead of polling, and add delivery-partner assignment with live location.",
    features: ["Restaurant listing with search and cuisine filters", "Menus with categories, prices and availability", "Cart and checkout with an order summary", "Order tracking: placed → preparing → out for delivery → delivered", "Restaurant dashboard to manage menus and incoming orders", "User accounts with order history"],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
    link: "",
    github: "",
    image: "",
    gallery: [],
    motif: "grid",
    featured: true,
    order: 4,
    updatedAt: seedTime
  },
  {
    slug: "ironx",
    name: "IRONX",
    tagline: "Gym management for memberships, attendance and training.",
    category: "Web · Management",
    year: "2026",
    status: "Featured",
    role: "Full-stack developer",
    description:
      "A gym-management experience covering memberships, attendance, training programmes and member engagement.",
    problem: "Gym staff repeat the same admin tasks dozens of times a day — renewals, attendance and programme planning — across paper and spreadsheets.",
    outcome: "A single dashboard for memberships, attendance and training programmes, with AI-assisted workout suggestions to save staff time.",
    content:
      "## The constraint\nGym staff repeat the same tasks dozens of times a day: checking memberships, logging visits and planning workouts. Spreadsheets and paper registers make renewals easy to miss and give no picture of attendance over time.\n\n## What I built\nA PHP and MySQL management system with an AI assistant for programme ideas.\n\n- **Memberships** with plans, start and end dates, and renewal tracking.\n- **Attendance** logging with simple reports per member and per day.\n- **AI-assisted workouts.** Member goals are sent to the Gemini API, and the suggested plan is shown to staff to review and adjust — never applied automatically.\n\n```flow\ntitle: High-level flow — fast daily admin, with AI suggestions staff can review.\nlanes: 01 / Staff | 02 / Web app | 03 / Database | 04 / AI\nstaff: Gym staff / front desk @1 input\nmembers: Memberships / plans, renewals @2\nattendance: Attendance / check-ins @2.2\ndb: MySQL / members, visits @3 store\ngemini: Gemini API / workout ideas @4 accent\nstaff -> members: manage\nstaff -> attendance: log visit\nmembers ..> db: save\nattendance ..> db: save\nmembers -> gemini: member goals\ngemini ~> members: suggested plan\n```\n\n## What was hard\n- **Speed of common actions.** The most frequent tasks had to take one or two clicks, which meant redesigning screens around the front-desk workflow.\n- **Keeping AI optional.** Suggestions are a starting point for staff, so the UI makes it clear they can be edited or ignored.\n\n## What I’d do differently\nAdd role-based logins for trainers versus front-desk staff, and reminders for upcoming renewals.",
    features: ["Membership plans and renewals", "Attendance tracking", "Training programme management", "AI-assisted workout suggestions"],
    stack: ["PHP", "MySQL", "Gemini API", "JavaScript"],
    link: "",
    github: "",
    image: "",
    gallery: [],
    motif: "bars",
    featured: true,
    order: 5,
    updatedAt: seedTime
  },
  {
    slug: "rangsutra",
    name: "RangSutra",
    tagline: "A digital Rangoli studio for geometric, Indian-inspired patterns.",
    category: "Creative technology",
    year: "2026",
    status: "Exploration",
    role: "Creative developer",
    description:
      "A digital Rangoli studio for creating, exploring and sharing geometric Indian-inspired patterns.",
    problem: "Rangoli’s intricate radial symmetry is hard to sketch digitally with ordinary drawing tools.",
    outcome: "A browser studio where every stroke is mirrored around a centre point, so simple gestures become shareable geometric patterns.",
    content:
      "## The constraint\nRangoli patterns rely on precise radial symmetry. Ordinary drawing tools make that tedious: every curve has to be repeated by hand around a centre point.\n\n## What I built\nA browser-based studio on the HTML Canvas API.\n\n- **Symmetry engine.** Each pointer stroke is rotated and optionally mirrored into N segments around the centre.\n- **Palettes.** Colour palettes inspired by traditional Rangoli.\n- **Export.** Finished artwork can be downloaded as an image to share.\n\n```flow\ntitle: High-level flow — one stroke in, a symmetric pattern out.\nlanes: 01 / Input | 02 / Symmetry engine | 03 / Canvas | 04 / Output\nstroke: Pointer stroke / mouse, touch @1 input\nmirror: Rotate & mirror / N segments @2\npalette: Colour palette / traditional @2.2\ncanvas: HTML Canvas / render loop @3\npng: Exported image / PNG download @4\nstroke -> mirror: points\nmirror -> canvas: N copies\npalette -> canvas: colours\ncanvas -> png: export\n```\n\n## What was hard\n- **Smooth lines.** Raw pointer events produce jagged strokes; smoothing points before rendering made lines feel natural.\n- **Performance.** Drawing many mirrored copies per stroke needs careful redraws to stay responsive.\n\n## What I’d do differently\nAdd undo/redo history and a gallery so people can share and remix each other’s patterns.",
    features: ["Radial symmetry drawing", "Adjustable symmetry segments", "Traditional colour palettes", "Export artwork as an image"],
    stack: ["JavaScript", "Canvas API", "CSS"],
    link: "",
    github: "",
    image: "",
    gallery: [],
    motif: "radial",
    featured: false,
    order: 6,
    updatedAt: seedTime
  },
  {
    slug: "flowgrid",
    name: "FlowGrid",
    tagline: "Exploring algorithmic route optimisation for city traffic.",
    category: "Algorithms · Python",
    year: "2026",
    status: "Academic",
    role: "Developer",
    description:
      "An intelligent traffic-management concept exploring route optimization and algorithmic decision-making.",
    problem: "City traffic routing decisions ignore how congestion shifts as conditions change across the network.",
    outcome: "A graph model of a city where shortest-path routes adapt to simulated traffic load, making it easy to compare routing strategies.",
    content:
      "## The constraint\nRouting decisions in a city change as traffic builds up, but simple shortest-path routing treats every road as if it were always empty. The project explores how routes change when road weights reflect live load.\n\n## What I built\nA Python model of a city as a weighted graph.\n\n- **Graph model.** Junctions are nodes and roads are weighted edges.\n- **Routing.** Dijkstra’s algorithm and A* search compute routes between any two points.\n- **Simulated traffic.** Edge weights update with simulated load, so routes adapt and strategies can be compared.\n\n```flow\ntitle: High-level flow — city data to compared routes.\nlanes: 01 / City data | 02 / Graph model | 03 / Routing | 04 / Results\nmap: Road network / junctions, roads @1 input\ntraffic: Traffic load / simulated @1.2 input\ngraph: Weighted graph / nodes + edges @2 store\ndijkstra: Dijkstra / shortest path @3\nastar: A* search / heuristic @3.2\ncompare: Route comparison / time, distance @4\nmap -> graph: build\ntraffic ..> graph: update weights\ngraph -> dijkstra: query\ngraph -> astar: query\ndijkstra -> compare: route\nastar -> compare: route\n```\n\n## What was hard\n- **Choosing weights.** Small changes in how load maps to edge weight reshape routes across the whole grid.\n- **Fair comparisons.** Comparing algorithms meant running them on identical graph snapshots.\n\n## What I’d do differently\nUse real open map data (such as OpenStreetMap) and visualise routes on a map instead of in tables.",
    features: ["City modelled as a weighted graph", "Shortest-path routing", "Simulated traffic load", "Comparison of routing strategies"],
    stack: ["Python", "Graph algorithms", "Data analysis"],
    link: "",
    github: "",
    image: "",
    gallery: [],
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
