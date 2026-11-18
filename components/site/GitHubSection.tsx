import { GitFork, Github, Star } from "lucide-react";
import ContributionGraph from "@/components/site/ContributionGraph";
import { getContributions, getGitHubSummary } from "@/lib/github";
import { formatDate } from "@/lib/media";

/** Live GitHub stats. Renders nothing when no username is configured or GitHub is unreachable. */
export default async function GitHubSection({ username }: { username: string; index?: string }) {
  const [data, contributions] = await Promise.all([getGitHubSummary(username), getContributions(username)]);
  if (!data) return null;
  const { user, repos, languages, stars, forks } = data;
  const shades = ["#ff6600", "#222222", "#16a34a", "#7c3aed", "#0ea5e9", "#a3a3a3"];

  return (
    <section className="section" id="github">
      <div className="shell">
        <div className="section-head">
          <div data-reveal>
            <span className="eyebrow">Open source</span>
            <h2 className="section-title">Live from<br />my GitHub.</h2>
            <hr className="title-rule" style={{ marginBottom: 0 }} />
          </div>
          <p data-reveal>Pulled straight from my public GitHub profile, refreshed automatically.</p>
        </div>
        {contributions && <ContributionGraph data={contributions} username={data.user.login} />}
        <div className="gh-grid">
          <div className="gh-profile" data-reveal>
            <div className="gh-head">
              <img src={user.avatar_url} alt="" width={64} height={64} />
              <div>
                <strong style={{ fontSize: 18 }}>{user.name || user.login}</strong>
                <div className="muted mono" style={{ fontSize: 13 }}>@{user.login}</div>
              </div>
            </div>
            {user.bio && <p className="muted">{user.bio}</p>}
            <div className="gh-stats">
              <div><strong>{user.public_repos}</strong><span>Public repositories</span></div>
              <div><strong>{stars}</strong><span>Stars earned</span></div>
              <div><strong>{user.followers}</strong><span>Followers</span></div>
              <div><strong>{forks}</strong><span>Forks</span></div>
            </div>
            {languages.length > 0 && (
              <div>
                <div className="eyebrow plain" style={{ marginBottom: 12 }}>Most used languages</div>
                <div className="lang-bar" role="img" aria-label={languages.map(l => `${l.name} ${Math.round(l.share * 100)}%`).join(", ")}>
                  {languages.map((l, i) => <span key={l.name} style={{ width: `${l.share * 100}%`, background: shades[i] }} />)}
                </div>
                <ul className="lang-list" style={{ listStyle: "none", padding: 0 }}>
                  {languages.map((l, i) => (
                    <li key={l.name}>
                      <i style={{ background: shades[i] }} />
                      {l.name} <span className="muted">{Math.round(l.share * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <a className="btn btn-ghost" href={user.html_url} target="_blank" rel="noreferrer" style={{ marginTop: "auto" }}>
              <Github size={15} /> View GitHub profile
            </a>
          </div>
          <div className="repo-grid">
            {repos.slice(0, 6).map((r, i) => (
              <a key={r.full_name} className="repo" href={r.html_url} target="_blank" rel="noreferrer" data-reveal style={{ ["--d" as string]: `${(i % 2) * 0.06}s` }}>
                <h4>{r.name} <Github size={14} /></h4>
                <p>{r.description || "No description provided."}</p>
                <div className="repo-meta">
                  {r.language && <span>{r.language}</span>}
                  <span><Star size={12} /> {r.stargazers_count}</span>
                  <span><GitFork size={12} /> {r.forks_count}</span>
                  <span style={{ marginLeft: "auto" }}>{formatDate(r.pushed_at, { month: "short", year: "numeric" })}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
