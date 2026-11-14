import { Fragment, type ReactNode } from "react";
import { FlowFigure } from "@/components/FlowDiagram";

/**
 * Tiny, dependency-free Markdown renderer that outputs React elements (never raw HTML).
 * Supports: # headings, paragraphs, **bold**, *italic*, `code`, ```fenced code```,
 * [links](url), ![images](url), > quotes, - / 1. lists, and --- rules.
 */

export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function safeUrl(url: string) {
  const u = url.trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(u) ? u : "#";
}

function inline(text: string, keyBase = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(!?\[[^\]]*\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index).replace(/\\(.)/g, "$1"));
    const t = m[0];
    const key = `${keyBase}-${k++}`;
    if (t.startsWith("`")) out.push(<code key={key}>{t.slice(1, -1)}</code>);
    else if (t.startsWith("**")) out.push(<strong key={key}>{inline(t.slice(2, -2), key)}</strong>);
    else if (t.startsWith("*")) out.push(<em key={key}>{inline(t.slice(1, -1), key)}</em>);
    else {
      const lm = t.match(/^(!?)\[([^\]]*)\]\(([^)\s]+)\)$/)!;
      const href = safeUrl(lm[3]);
      if (lm[1]) out.push(<img key={key} src={href} alt={lm[2]} loading="lazy" />);
      else {
        const external = /^https?:\/\//i.test(href);
        out.push(
          <a key={key} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {inline(lm[2], key)}
          </a>
        );
      }
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last).replace(/\\(.)/g, "$1"));
  return out;
}

export function Markdown({ source, className = "prose" }: { source: string; className?: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const isBlockStart = (l: string) => /^(#{1,4}\s|```|>\s?|[-*]\s|\d+\.\s|---\s*$|!\[)/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      if (lang === "flow") blocks.push(<FlowFigure key={key++} source={code.join("\n")} />);
      else blocks.push(<pre key={key++} data-lang={lang || undefined}><code>{code.join("\n")}</code></pre>);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = Math.max(2, Math.min(h[1].length, 4));
      const Tag = (`h${level}`) as "h2" | "h3" | "h4";
      const hid = headingId(h[2]);
      blocks.push(<Tag key={key++} id={hid}>{inline(h[2])}<a className="h-anchor" href={`#${hid}`} aria-label="Link to this section">#</a></Tag>);
      i++;
      continue;
    }

    if (/^---\s*$/.test(line)) { blocks.push(<hr key={key++} />); i++; continue; }

    if (/^>\s?/.test(line)) {
      const q: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={key++}><p>{inline(q.join(" "))}</p></blockquote>);
      continue;
    }

    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const items: string[] = [];
      const re = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ""));
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={key++}>{items.map((it, n) => <li key={n}>{inline(it, `l${n}`)}</li>)}</List>);
      continue;
    }

    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/);
    if (img) {
      blocks.push(
        <figure key={key++}>
          <img src={safeUrl(img[2])} alt={img[1]} loading="lazy" />
          {img[1] && <figcaption>{img[1]}</figcaption>}
        </figure>
      );
      i++;
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !(para.length && isBlockStart(lines[i]))) para.push(lines[i++]);
    blocks.push(<p key={key++}>{inline(para.join(" "))}</p>);
  }

  return <div className={className}>{blocks.map((b, n) => <Fragment key={n}>{b}</Fragment>)}</div>;
}

export function tableOfContents(source: string) {
  return source
    .split("\n")
    .map(l => l.match(/^(#{1,2})\s+(.*)$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map(m => ({ text: m[2].replace(/[*`]/g, ""), id: headingId(m[2]) }));
}
