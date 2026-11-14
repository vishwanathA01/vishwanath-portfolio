import type { ReactNode } from "react";
import type { Motif } from "@/lib/types";
import { LOGO_PATH } from "./Logo";

/** Deterministic generative cover art for projects without an uploaded image. Monochrome, theme-aware. */

function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n: number) => Math.round(n * 10) / 10;
const W = 800;
const H = 500;

function network(rand: () => number) {
  const pts: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) pts.push([r1(80 + c * 107 + (rand() - 0.5) * 60), r1(70 + r * 120 + (rand() - 0.5) * 60)]);
  const edges = new Set<string>();
  pts.forEach((p, i) => {
    pts
      .map((q, j) => ({ j, d: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 }))
      .filter(x => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });
  const hub = pts.reduce((best, p, i) => (Math.hypot(p[0] - 400, p[1] - 250) < Math.hypot(pts[best][0] - 400, pts[best][1] - 250) ? i : best), 0);
  const [hx, hy] = pts[hub];
  const out: ReactNode[] = [];
  edges.forEach(e => {
    const [a, b] = e.split("-").map(Number);
    out.push(<line key={e} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} strokeOpacity={0.3} strokeWidth={1.4} />);
  });
  pts.forEach((p, i) => {
    if (i === hub || rand() > 0.3) return;
    out.push(<line key={`h${i}`} x1={hx} y1={hy} x2={p[0]} y2={p[1]} strokeWidth={2.2} strokeDasharray="2 7" strokeLinecap="round" strokeOpacity={0.8} />);
  });
  [64, 42, 24].forEach((r, i) => out.push(<circle key={`ring${r}`} cx={hx} cy={hy} r={r} className="cv-bg" strokeOpacity={0.25 + i * 0.3} strokeWidth={1.5} />));
  out.push(<circle key="core" cx={hx} cy={hy} r={11} fill="currentColor" stroke="none" />);
  pts.forEach((p, i) => {
    if (i === hub) return;
    const r = r1(3 + rand() * 5);
    out.push(<circle key={`n${i}`} cx={p[0]} cy={p[1]} r={r} className={rand() < 0.4 ? undefined : "cv-bg"} fill={undefined} strokeWidth={2} />);
  });
  return out;
}

function grid(rand: () => number) {
  const out: ReactNode[] = [];
  const s = 66;
  const pitch = 82;
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 9; c++) {
      const x = 33 + c * pitch;
      const y = 47 + r * pitch;
      const k = `${r}-${c}`;
      const t = Math.floor(rand() * 9);
      if (t === 0) out.push(<rect key={k} x={x} y={y} width={s} height={s} strokeOpacity={0.35} strokeWidth={1.5} className="cv-bg" />);
      else if (t === 1) out.push(<rect key={k} x={x} y={y} width={s} height={s} fill="currentColor" stroke="none" />);
      else if (t === 2) out.push(<path key={k} d={`M${x} ${y + s}L${x + s} ${y}L${x + s} ${y + s}Z`} fill="currentColor" stroke="none" />);
      else if (t === 3) out.push(<circle key={k} cx={x + s / 2} cy={y + s / 2} r={s / 2 - 1} strokeWidth={2} className="cv-bg" />);
      else if (t === 4) out.push(<circle key={k} cx={x + s / 2} cy={y + s / 2} r={s / 4} fill="currentColor" stroke="none" />);
      else if (t === 5)
        out.push(
          <g key={k} strokeWidth={4}>
            {[0.2, 0.5, 0.8].map(f => <line key={f} x1={x + s * f} y1={y} x2={x + s * f} y2={y + s} />)}
          </g>
        );
      else if (t === 6) out.push(<path key={k} d={`M${x} ${y}H${x + s}A${s} ${s} 0 0 1 ${x} ${y + s}Z`} fill="currentColor" stroke="none" />);
      else out.push(<rect key={k} x={x} y={y} width={s} height={s} strokeOpacity={0.12} strokeWidth={1} fill="none" />);
    }
  return out;
}

function radial(rand: () => number) {
  const out: ReactNode[] = [];
  const cx = 400;
  const cy = 250;
  const rings = [44, 86, 132, 180, 228];
  rings.forEach((r, ri) => {
    const n = ri % 2 ? 16 : 8;
    const offset = rand() * (Math.PI / n);
    const star: string[] = [];
    for (let i = 0; i < n * 2; i++) {
      const a = offset + (i * Math.PI) / n;
      const rr = i % 2 ? r * 0.82 : r;
      star.push(`${r1(cx + Math.cos(a) * rr)},${r1(cy + Math.sin(a) * rr)}`);
    }
    out.push(<polygon key={`s${r}`} points={star.join(" ")} strokeWidth={1.5} strokeOpacity={0.45 + ri * 0.1} fill="none" />);
    for (let i = 0; i < n; i++) {
      const deg = r1((offset * 180) / Math.PI + (i * 360) / n);
      if (ri % 2 === 0)
        out.push(<ellipse key={`p${r}-${i}`} cx={cx} cy={r1(cy - r * 0.62)} rx={r1(r * 0.09)} ry={r1(r * 0.24)} transform={`rotate(${deg} ${cx} ${cy})`} fill={ri === 2 ? "currentColor" : "none"} strokeWidth={1.6} />);
      else out.push(<circle key={`d${r}-${i}`} cx={cx} cy={r1(cy - r)} r={ri === 3 ? 5 : 3.5} transform={`rotate(${deg} ${cx} ${cy})`} fill="currentColor" stroke="none" />);
    }
  });
  out.push(<circle key="c1" cx={cx} cy={cy} r={22} strokeWidth={2} fill="none" />);
  out.push(<circle key="c2" cx={cx} cy={cy} r={10} fill="currentColor" stroke="none" />);
  return out;
}

function flow(rand: () => number) {
  const xs = [110, 300, 500, 690];
  const ys = [100, 250, 400];
  const out: ReactNode[] = [];
  xs.forEach(x =>
    out.push(
      <g key={`v${x}`} strokeOpacity={0.4} strokeWidth={1.4}>
        <line x1={x - 11} y1={0} x2={x - 11} y2={H} />
        <line x1={x + 11} y1={0} x2={x + 11} y2={H} />
        <line x1={x} y1={0} x2={x} y2={H} strokeDasharray="10 12" strokeOpacity={0.5} />
      </g>
    )
  );
  ys.forEach(y =>
    out.push(
      <g key={`h${y}`} strokeOpacity={0.4} strokeWidth={1.4}>
        <line x1={0} y1={y - 11} x2={W} y2={y - 11} />
        <line x1={0} y1={y + 11} x2={W} y2={y + 11} />
        <line x1={0} y1={y} x2={W} y2={y} strokeDasharray="10 12" strokeOpacity={0.5} />
      </g>
    )
  );
  for (let i = 0; i < 14; i++) {
    const vertical = rand() < 0.5;
    const lane = vertical ? xs[Math.floor(rand() * xs.length)] : ys[Math.floor(rand() * ys.length)];
    const pos = r1(20 + rand() * (vertical ? H - 40 : W - 40));
    const side = rand() < 0.5 ? -5.5 : 5.5;
    out.push(vertical
      ? <rect key={`car${i}`} x={lane + side - 3.5} y={pos} width={7} height={16} rx={2} fill="currentColor" stroke="none" fillOpacity={0.55} />
      : <rect key={`car${i}`} x={pos} y={lane + side - 3.5} width={16} height={7} rx={2} fill="currentColor" stroke="none" fillOpacity={0.55} />);
  }
  let xi = 0;
  let yi = 0;
  const route: [number, number][] = [[xs[0], -20], [xs[0], ys[0]]];
  while (xi < xs.length - 1 || yi < ys.length - 1) {
    if (yi === ys.length - 1 || (xi < xs.length - 1 && rand() < 0.55)) xi++;
    else yi++;
    route.push([xs[xi], ys[yi]]);
  }
  route.push([W + 20, ys[yi]]);
  out.push(<polyline key="route" points={route.map(p => p.join(",")).join(" ")} fill="none" strokeWidth={6} strokeLinejoin="round" />);
  route.slice(1, -1).forEach(([x, y], i) => out.push(<rect key={`j${i}`} x={x - 9} y={y - 9} width={18} height={18} className="cv-bg" strokeWidth={3} />));
  out.push(<circle key="start" cx={xs[0]} cy={ys[0]} r={13} fill="currentColor" stroke="none" />);
  return out;
}

function bars(rand: () => number) {
  const out: ReactNode[] = [];
  const n = 26;
  const base = 420;
  const p1 = rand() * 6;
  const p2 = rand() * 6;
  const heights = Array.from({ length: n }, (_, i) => r1(90 + 120 * (0.5 + 0.5 * Math.sin(i / 3 + p1)) + 90 * (0.5 + 0.5 * Math.sin(i / 1.7 + p2)) + rand() * 30));
  const step = 680 / n;
  heights.forEach((h, i) => {
    const x = r1(60 + i * step);
    const solid = i % 4 !== 1;
    out.push(<rect key={i} x={x} y={r1(base - h)} width={r1(step * 0.62)} height={h} fill={solid ? "currentColor" : "none"} className={solid ? undefined : "cv-bg"} stroke={solid ? "none" : undefined} strokeWidth={2} />);
  });
  const line = heights.map((h, i) => `${r1(60 + i * step + step * 0.31)},${r1(base - h - 34)}`);
  out.push(<polyline key="trend" points={line.join(" ")} fill="none" strokeWidth={1.6} strokeOpacity={0.55} strokeDasharray="3 5" />);
  out.push(<line key="base" x1={40} y1={base + 12} x2={760} y2={base + 12} strokeWidth={2} />);
  for (let i = 0; i <= 8; i++) out.push(<line key={`t${i}`} x1={40 + i * 90} y1={base + 12} x2={40 + i * 90} y2={base + 22} strokeWidth={1.5} strokeOpacity={0.6} />);
  return out;
}

function stripes(rand: () => number) {
  const out: ReactNode[] = [];
  const slope = 0.438;
  const shift = rand() * 40;
  for (let i = -14; i < 26; i++) {
    const x = r1(i * 38 + shift);
    out.push(<line key={i} x1={x} y1={0} x2={r1(x + slope * H)} y2={H} strokeWidth={i % 3 === 0 ? 12 : 2} strokeOpacity={i % 3 === 0 ? 1 : 0.35} />);
  }
  out.push(<path key="logo" d={LOGO_PATH} transform="translate(470 230) scale(0.36)" className="cv-bg" strokeWidth={6} />);
  return out;
}

const painters: Record<Motif, (rand: () => number) => ReactNode[]> = { network, grid, radial, flow, bars, stripes };

export type Tone = "forest" | "clay" | "sand" | "cream";
const motifTone: Record<Motif, Tone> = { network: "forest", grid: "sand", bars: "clay", radial: "cream", flow: "sand", stripes: "forest" };

export default function Cover({ motif, seed, className, tone }: { motif: Motif; seed: string; className?: string; tone?: Tone }) {
  const paint = painters[motif] || stripes;
  return (
    <svg className={`cover-art tone-${tone || motifTone[motif] || "sand"} ${className || ""}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" stroke="currentColor" fill="none">
      <rect width={W} height={H} className="cv-bg" stroke="none" />
      {paint(rng(seed + motif))}
    </svg>
  );
}
