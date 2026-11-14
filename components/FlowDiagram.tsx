import type { ReactNode } from "react";

/**
 * Text-to-flowchart renderer used inside Markdown ```flow blocks.
 *
 *   title: High-level flow
 *   lanes: 01 / Input | 02 / App | 03 / AI
 *   ui: Dashboard / Next.js @2          node  id: Title / subtitle @lane[.row] [input|store|accent]
 *   db: Database / MySQL @3.2 store
 *   ui -> db: save                      ->  primary   ..>  async (dashed)   ~>  data flow
 */

type Kind = "process" | "input" | "store" | "accent";
type EdgeType = "primary" | "async" | "data";
type FlowNode = { id: string; title: string; sub: string; lane: number; row: number; kind: Kind; x: number; y: number };
type FlowEdge = { from: string; to: string; label: string; type: EdgeType };
export type Flow = { title: string; lanes: string[]; nodes: FlowNode[]; edges: FlowEdge[] };

const KIND: Record<Kind, { fill: string; stroke: string }> = {
  process: { fill: "#ecfdf3", stroke: "#16a34a" },
  input: { fill: "#f1f5f9", stroke: "#64748b" },
  store: { fill: "#f3e8ff", stroke: "#7c3aed" },
  accent: { fill: "#fff3e8", stroke: "#ff6600" }
};
const EDGE: Record<EdgeType, { stroke: string; dash?: string; label: string }> = {
  primary: { stroke: "#16a34a", label: "primary flow" },
  async: { stroke: "#7c3aed", dash: "5 4", label: "async / write" },
  data: { stroke: "#94a3b8", label: "data flow" }
};

export function parseFlow(source: string): Flow | null {
  let title = "";
  let lanes: string[] = [];
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^title:\s*(.+)$/i))) title = m[1];
    else if ((m = line.match(/^lanes:\s*(.+)$/i))) lanes = m[1].split("|").map(s => s.trim()).filter(Boolean);
    else if ((m = line.match(/^([\w-]+)\s*(->|\.\.>|~>)\s*([\w-]+)\s*(?::\s*(.*))?$/))) {
      edges.push({ from: m[1], to: m[3], label: (m[4] || "").trim(), type: m[2] === "->" ? "primary" : m[2] === "..>" ? "async" : "data" });
    } else if ((m = line.match(/^([\w-]+)\s*:\s*(.+?)(?:\s+@(\d+)(?:\.(\d+))?)?(?:\s+(input|store|accent|process))?\s*$/i))) {
      const [t, s = ""] = m[2].split(/\s+\/\s+/);
      nodes.push({ id: m[1], title: t.trim(), sub: s.trim(), lane: Math.max(1, Number(m[3] || 1)), row: Number(m[4] || 0), kind: ((m[5] || "process").toLowerCase() as Kind), x: 0, y: 0 });
    }
  }
  if (!nodes.length) return null;
  // auto-assign rows within each lane where not given
  const used = new Map<number, Set<number>>();
  nodes.forEach(n => n.row && (used.get(n.lane) || used.set(n.lane, new Set()).get(n.lane)!).add(n.row));
  nodes.forEach(n => {
    if (n.row) return;
    const set = used.get(n.lane) || used.set(n.lane, new Set()).get(n.lane)!;
    let r = 1;
    while (set.has(r)) r++;
    n.row = r;
    set.add(r);
  });
  const ids = new Set(nodes.map(n => n.id));
  return { title, lanes, nodes, edges: edges.filter(e => ids.has(e.from) && ids.has(e.to)) };
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export default function FlowDiagram({ source }: { source: string }) {
  const flow = parseFlow(source);
  if (!flow) return null;
  const uid = hash(source);
  const laneCount = Math.max(flow.lanes.length, ...flow.nodes.map(n => n.lane));
  const rows = Math.max(...flow.nodes.map(n => n.row));
  const longest = Math.max(...flow.nodes.map(n => Math.max(n.title.length * 7.4, n.sub.length * 5.9)));
  const NW = Math.round(Math.min(Math.max(longest + 26, 128), 200));
  const NH = 54;
  const LW = NW + 36;
  const GAP = 14;
  const PAD = 18;
  const TOP = 54;
  const RH = 100;
  const backEdges = flow.edges.filter(e => {
    const a = flow.nodes.find(n => n.id === e.from)!;
    const b = flow.nodes.find(n => n.id === e.to)!;
    return b.lane < a.lane;
  });
  const BOTTOM_EXTRA = backEdges.length ? 26 + backEdges.length * 14 : 10;
  const LEGEND = 44;
  const W = PAD * 2 + laneCount * LW + (laneCount - 1) * GAP;
  const laneBottom = TOP + rows * RH - 10 + BOTTOM_EXTRA;
  const H = laneBottom + 14 + LEGEND;
  const laneX = (l: number) => PAD + (l - 1) * (LW + GAP);
  flow.nodes.forEach(n => {
    n.x = laneX(n.lane) + LW / 2;
    n.y = TOP + (n.row - 1) * RH + RH / 2 - 6;
  });
  const node = (id: string) => flow.nodes.find(n => n.id === id)!;

  const paths: ReactNode[] = [];
  const labels: ReactNode[] = [];
  let backIndex = 0;
  const label = (key: string, x: number, y: number, text: string, color: string) => {
    if (!text) return;
    const w = text.length * 5.4 + 10;
    labels.push(
      <g key={`l${key}`}>
        <rect x={x - w / 2} y={y - 8} width={w} height={15} rx={3} fill="#ffffff" opacity={0.92} />
        <text x={x} y={y + 3} textAnchor="middle" fontSize={9} fill={color}>{text}</text>
      </g>
    );
  };

  let skipIndex = 0;
  const blockedBelow = (n: FlowNode) => flow.nodes.some(o => o.lane === n.lane && o.row > n.row);
  flow.edges.forEach((e, i) => {
    const a = node(e.from);
    const b = node(e.to);
    const st = EDGE[e.type];
    let d = "";
    let lx = 0;
    let ly = 0;
    if (b.lane > a.lane) {
      const sx = a.x + NW / 2;
      const ex = b.x - NW / 2 - 2;
      if (b.lane - a.lane > 1) {
        // skip over intermediate lanes through the channel above the nodes
        const k = skipIndex++;
        const yc = Math.min(a.y, b.y) - NH / 2 - 12 - (k % 2) * 11;
        const x1 = sx + 10 + (k % 2) * 6;
        const x2 = ex - 12 - (k % 2) * 6;
        d = `M${sx} ${a.y}H${x1}V${yc}H${x2}V${b.y}H${ex}`;
        lx = (x1 + x2) / 2 + (k % 2 ? 46 : -46);
        ly = yc;
      } else if (a.y === b.y) {
        d = `M${sx} ${a.y}H${ex}`;
        lx = (sx + ex) / 2;
        ly = a.y - 10;
      } else {
        const mid = (sx + ex) / 2 + ((i % 3) - 1) * 6;
        d = `M${sx} ${a.y}H${mid}V${b.y}H${ex}`;
        lx = mid;
        ly = (a.y + b.y) / 2;
      }
    } else if (b.lane < a.lane) {
      const yb = laneBottom - BOTTOM_EXTRA + 18 + backIndex * 14;
      if (blockedBelow(b)) {
        // another node sits under the target: come in from its right side
        const xr = b.x + NW / 2 + 10 + backIndex * 6;
        d = `M${a.x} ${a.y + NH / 2}V${yb}H${xr}V${b.y}H${b.x + NW / 2 + 2}`;
      } else {
        d = `M${a.x} ${a.y + NH / 2}V${yb}H${b.x}V${b.y + NH / 2 + 2}`;
      }
      backIndex++;
      lx = (a.x + b.x) / 2;
      ly = yb;
    } else if (b.row > a.row) {
      d = `M${a.x} ${a.y + NH / 2}V${b.y - NH / 2 - 2}`;
      lx = a.x;
      ly = (a.y + b.y) / 2;
    } else {
      const xr = a.x + NW / 2 + 14;
      d = `M${a.x + NW / 2} ${a.y}H${xr}V${b.y}H${b.x + NW / 2 + 2}`;
      lx = xr;
      ly = (a.y + b.y) / 2;
    }
    paths.push(<path key={`e${i}`} d={d} fill="none" stroke={st.stroke} strokeWidth={1.6} strokeDasharray={st.dash} markerEnd={`url(#arrow-${e.type}-${uid})`} />);
    label(String(i), lx, ly, e.label, st.stroke);
  });

  const usedEdges = Array.from(new Set(flow.edges.map(e => e.type)));
  const hasStore = flow.nodes.some(n => n.kind === "store");
  let legendX = PAD + 8;
  const legendY = H - LEGEND / 2 - 2;

  return (
    <svg
      className="flow-svg"
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", minWidth: Math.min(W, 680), height: "auto" }}
      role="img"
      aria-label={`${flow.title || "Flowchart"}: ${flow.nodes.map(n => n.title).join(", ")}`}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    >
      <defs>
        <pattern id={`grid-${uid}`} width={20} height={20} patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#e9edf2" strokeWidth={1} />
        </pattern>
        {(Object.keys(EDGE) as EdgeType[]).map(t => (
          <marker key={t} id={`arrow-${t}-${uid}`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10Z" fill={EDGE[t].stroke} />
          </marker>
        ))}
      </defs>
      <rect width={W} height={H} fill="#f8fafc" />
      <rect width={W} height={H} fill={`url(#grid-${uid})`} />
      {Array.from({ length: laneCount }, (_, i) => (
        <g key={`lane${i}`}>
          <rect x={laneX(i + 1)} y={14} width={LW} height={laneBottom - 14} rx={8} fill="#ffffff" fillOpacity={0.35} stroke="#cbd5e1" strokeDasharray="4 4" />
          <text x={laneX(i + 1) + 12} y={32} fontSize={9.5} fill="#64748b">{flow.lanes[i] || `${String(i + 1).padStart(2, "0")}`}</text>
        </g>
      ))}
      {paths}
      {flow.nodes.map(n => {
        const k = KIND[n.kind] || KIND.process;
        return (
          <g key={n.id}>
            <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx={7} fill={k.fill} stroke={k.stroke} strokeWidth={1.4} />
            <text x={n.x} y={n.sub ? n.y - 3 : n.y + 4} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="#1e293b">{n.title}</text>
            {n.sub && <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize={9} fill="#64748b">{n.sub}</text>}
          </g>
        );
      })}
      {labels}
      <text x={PAD + 8} y={legendY - 12} fontSize={10} fontWeight={600} fill="#1e293b">Legend</text>
      {usedEdges.map(t => {
        const x = legendX;
        legendX += 40 + EDGE[t].label.length * 5.8 + 18;
        return (
          <g key={`lg${t}`}>
            <path d={`M${x} ${legendY + 6}H${x + 32}`} stroke={EDGE[t].stroke} strokeWidth={1.8} strokeDasharray={EDGE[t].dash} markerEnd={`url(#arrow-${t}-${uid})`} />
            <text x={x + 40} y={legendY + 9} fontSize={9.5} fill="#475569">{EDGE[t].label}</text>
          </g>
        );
      })}
      {hasStore && (
        <g>
          <rect x={legendX} y={legendY} width={16} height={11} rx={3} fill={KIND.store.fill} stroke={KIND.store.stroke} />
          <text x={legendX + 22} y={legendY + 9} fontSize={9.5} fill="#475569">data store</text>
        </g>
      )}
    </svg>
  );
}

export function FlowFigure({ source }: { source: string }) {
  const flow = parseFlow(source);
  if (!flow) return <pre><code>{source}</code></pre>;
  return (
    <figure className="flow-figure">
      <div className="flow-scroll"><FlowDiagram source={source} /></div>
      {flow.title && <figcaption>{flow.title}</figcaption>}
    </figure>
  );
}
