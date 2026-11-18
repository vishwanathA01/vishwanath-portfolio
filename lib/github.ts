/** Server-side GitHub API helpers. Public data only; set GITHUB_TOKEN to raise the rate limit. */

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

export type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  pushed_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
};

export type GitHubSummary = {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: { name: string; count: number; share: number }[];
  stars: number;
  forks: number;
};

const TTL = 10 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();

async function gh<T>(path: string): Promise<T | null> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-site",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const value = (await res.json()) as T;
    cache.set(path, { at: Date.now(), value });
    return value;
  } catch {
    return null;
  }
}

const validUser = (u: string) => /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(u);

export async function getRepos(username: string): Promise<GitHubRepo[] | null> {
  if (!validUser(username)) return null;
  const repos = await gh<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=pushed&type=owner`);
  return repos ? repos.filter(r => !r.fork) : null;
}

export async function getGitHubSummary(username: string): Promise<GitHubSummary | null> {
  if (!username || !validUser(username)) return null;
  const [user, repos] = await Promise.all([gh<GitHubUser>(`/users/${username}`), getRepos(username)]);
  if (!user || !repos) return null;
  const counts = new Map<string, number>();
  for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) || 0) + 1);
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;
  const languages = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, share: count / total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  return {
    user,
    repos: repos.filter(r => !r.archived),
    languages,
    stars: repos.reduce((a, r) => a + r.stargazers_count, 0),
    forks: repos.reduce((a, r) => a + r.forks_count, 0)
  };
}

export type ContributionDay = { date: string; level: number; count: number };
export type Contributions = {
  days: ContributionDay[];
  total: number;
  currentStreak: number;
  longestStreak: number;
  best: ContributionDay | null;
  activeDays: number;
};

const contribCache = new Map<string, { at: number; value: Contributions | null }>();

/**
 * Contribution calendar for the last year, read from GitHub's public profile calendar
 * (the same HTML github.com renders on profile pages — no token needed).
 * Returns null if GitHub is unreachable or the markup changes, so the UI simply hides the graph.
 */
export async function getContributions(username: string): Promise<Contributions | null> {
  if (!username || !validUser(username)) return null;
  const hit = contribCache.get(username);
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  let value: Contributions | null = null;
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: { "User-Agent": "portfolio-site", Accept: "text/html" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) value = parseContributions(await res.text());
  } catch {
    value = null;
  }
  contribCache.set(username, { at: Date.now(), value });
  return value;
}

export function parseContributions(html: string): Contributions | null {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^\s*(\d[\d,]*)\s+contribution/);
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const tag = m[0];
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? NaN);
    const id = tag.match(/\bid="([^"]+)"/)?.[1] || "";
    if (!date || Number.isNaN(level)) continue;
    days.push({ date, level, count: counts.get(id) ?? (level > 0 ? 1 : 0) });
  }
  if (days.length < 7) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Current streak counts back from today; an empty "today" doesn't break it yet.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else if (i === days.length - 1) continue;
    else break;
  }
  const best = days.reduce<ContributionDay | null>((b, d) => (d.count > (b?.count ?? 0) ? d : b), null);
  return {
    days,
    total: days.reduce((a, d) => a + d.count, 0),
    currentStreak: current,
    longestStreak: longest,
    best,
    activeDays: days.filter(d => d.count > 0).length
  };
}
