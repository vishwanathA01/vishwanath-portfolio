"use client";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Group = { group: string; blurb: string; items: string[] };
type ProjectRef = { slug: string; name: string; stack: string[] };

const norm = (s: string) => s.toLowerCase().replace(/\.js$/, "js").replace(/[^a-z0-9]+/g, "");

/** Does a project's stack include this skill? "HTML & CSS" matches "HTML", "CSS" or "HTML & CSS". */
function uses(stack: string[], skill: string) {
  const parts = skill.split(/\s*(?:&|\/|,)\s*/).map(norm).filter(Boolean);
  const want = new Set([norm(skill), ...parts]);
  return stack.some(s => {
    const n = norm(s);
    return want.has(n) || s.split(/\s*(?:&|\/|,)\s*/).map(norm).some(p => want.has(p));
  });
}

/**
 * Interactive toolkit: pick a group, then a skill, to see which case studies actually use it.
 * Keyboard: arrow keys move between groups (WAI-ARIA tabs pattern).
 */
export default function SkillsExplorer({ groups, projects }: { groups: Group[]; projects: ProjectRef[] }) {
  const [active, setActive] = useState(0);
  const [skill, setSkill] = useState<string | null>(null);
  const uid = useId();
  const g = groups[active];

  const usedIn = useMemo(() => {
    const map = new Map<string, ProjectRef[]>();
    groups.forEach(gr => gr.items.forEach(item => map.set(item, projects.filter(p => uses(p.stack, item)))));
    return map;
  }, [groups, projects]);

  function pick(i: number) {
    setActive(i);
    setSkill(null);
  }

  function onKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + groups.length) % groups.length;
    pick(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  const selected = skill ? usedIn.get(skill) || [] : [];

  return (
    <div className="skills">
      <div className="skills-tabs" role="tablist" aria-label="Skill groups" aria-orientation="vertical">
        {groups.map((gr, i) => (
          <button
            key={gr.group}
            id={`${uid}-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => pick(i)}
            onKeyDown={onKey}
          >
            <span className="skills-num">{String(i + 1).padStart(2, "0")}</span>
            <span>{gr.group}</span>
            <sup>{gr.items.length}</sup>
          </button>
        ))}
      </div>
      <div className="skills-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`} key={g.group}>
        <h3>{g.group}</h3>
        <p className="muted">{g.blurb}</p>
        <div className="skills-chips">
          {g.items.map(item => {
            const count = usedIn.get(item)?.length || 0;
            return (
              <button key={item} className="skill-chip" aria-pressed={skill === item} onClick={() => setSkill(s => (s === item ? null : item))}>
                {item}
                {count > 0 && <span className="skill-count" aria-label={`used in ${count} project${count === 1 ? "" : "s"}`}>{count}</span>}
              </button>
            );
          })}
        </div>
        <div className="skills-used" aria-live="polite">
          {!skill ? (
            <span className="muted">Select a skill to see where I’ve used it.</span>
          ) : selected.length ? (
            <>
              <span className="eyebrow plain">{skill} in practice</span>
              <div className="skills-projects">
                {selected.map(p => (
                  <Link key={p.slug} href={`/projects/${p.slug}`}>{p.name} <ArrowUpRight size={13} /></Link>
                ))}
              </div>
            </>
          ) : (
            <span className="muted"><strong style={{ color: "var(--ink)" }}>{skill}</strong> isn’t part of a published case study yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
