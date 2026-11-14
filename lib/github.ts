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
