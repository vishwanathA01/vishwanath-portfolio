import type { Contributions } from "@/lib/github";
import { formatDate } from "@/lib/media";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** GitHub-style contribution heatmap: one column per week, Sunday at the top. */
export default function ContributionGraph({ data, username }: { data: Contributions; username: string }) {
  const { days } = data;
  const lead = new Date(`${days[0].date}T00:00:00Z`).getUTCDay(); // empty cells before the first day
  const weeks = Math.ceil((lead + days.length) / 7);

  // Label a column when its first day starts a new month (skipping labels that would collide).
  const labels: { col: number; text: string }[] = [];
  let prevMonth = -1;
  for (let col = 0; col < weeks; col++) {
    const d = days[Math.max(0, col * 7 - lead)];
    if (!d) continue;
    const m = Number(d.date.slice(5, 7)) - 1;
    if (m === prevMonth) continue;
    prevMonth = m;
    if (!labels.length || col - labels[labels.length - 1].col >= 3) labels.push({ col, text: MONTHS[m] });
  }

  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const stats = [
    { value: data.total, label: "Contributions this year" },
    { value: data.activeDays, label: "Active days" },
    { value: data.longestStreak, label: "Longest streak (days)" },
    ...(data.currentStreak > 0 ? [{ value: data.currentStreak, label: "Current streak (days)" }] : [])
  ];

  return (
    <div className="contrib" data-reveal>
      <div className="contrib-head">
        <div>
          <span className="eyebrow plain">Contribution activity</span>
          <p className="muted" style={{ fontSize: 14.5, marginTop: 4 }}>
            {plural(data.total, "contribution")} on GitHub in the last year
            {data.best && data.best.count > 0 ? <> · busiest day {formatDate(data.best.date)} ({plural(data.best.count, "contribution")})</> : null}.
          </p>
        </div>
        <a className="link-arrow" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">@{username}</a>
      </div>
      <div className="contrib-scroll">
        <div className="contrib-months" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }} aria-hidden="true">
          {labels.map(l => <span key={l.col} style={{ gridColumn: `${l.col + 1} / span 3` }}>{l.text}</span>)}
        </div>
        <div
          className="contrib-grid"
          style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
          role="img"
          aria-label={`${plural(data.total, "contribution")} in the last year, longest streak ${plural(data.longestStreak, "day")}.`}
        >
          {Array.from({ length: lead }, (_, i) => <i key={`pad-${i}`} className="pad" />)}
          {days.map(d => (
            <i key={d.date} data-level={d.level} title={`${d.count ? plural(d.count, "contribution") : "No contributions"} on ${formatDate(d.date)}`} />
          ))}
        </div>
      </div>
      <div className="contrib-foot">
        <dl className="contrib-stats">
          {stats.map(s => (
            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
        <div className="contrib-legend" aria-hidden="true">
          Less {[0, 1, 2, 3, 4].map(l => <i key={l} data-level={l} />)} More
        </div>
      </div>
    </div>
  );
}
