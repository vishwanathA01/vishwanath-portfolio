import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/Logo";
import { profile } from "@/lib/data";
import { siteOrigin } from "@/lib/site";

/** Shared renderer for the generated social-share (Open Graph) images. */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const INK = "#222222";
const MUTED = "#6b6b6b";
const ACCENT = "#ff6600";
const PAPER = "#f6f6ef";

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 600; style: "normal" }[]> | null = null;
function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(process.cwd(), "assets/fonts/newsreader-latin-600-normal.woff")).then(data => ({ name: "Newsreader", data, weight: 600 as const, style: "normal" as const })),
    readFile(join(process.cwd(), "assets/fonts/poppins-latin-400-normal.woff")).then(data => ({ name: "Poppins", data, weight: 400 as const, style: "normal" as const })),
    readFile(join(process.cwd(), "assets/fonts/poppins-latin-500-normal.woff")).then(data => ({ name: "Poppins", data, weight: 500 as const, style: "normal" as const }))
  ]);
  return fonts;
}

const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

/**
 * Turns an image reference into something the renderer can draw: data URLs pass through,
 * files in /public are inlined, and anything else becomes an absolute URL. WebP/SVG are skipped
 * because the renderer can't decode them reliably.
 */
export async function ogImageSrc(src: string): Promise<string> {
  if (!src) return "";
  if (src.startsWith("data:image/jpeg") || src.startsWith("data:image/png")) return src;
  if (src.startsWith("data:")) return "";
  if (/^https?:\/\//.test(src)) return src;
  const clean = src.split("?")[0];
  const ext = clean.split(".").pop()?.toLowerCase() || "";
  if (clean.startsWith("/") && MIME[ext]) {
    try {
      const buf = await readFile(join(process.cwd(), "public", clean));
      return `data:${MIME[ext]};base64,${buf.toString("base64")}`;
    } catch {
      return `${await siteOrigin()}${clean}`;
    }
  }
  return "";
}

const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export async function renderOg({
  kind,
  title,
  subtitle,
  tags = [],
  image = "",
  portrait = false
}: {
  kind: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  image?: string;
  portrait?: boolean;
}) {
  const [fontData, origin] = await Promise.all([loadFonts(), siteOrigin()]);
  const domain = origin.replace(/^https?:\/\//, "");
  const hasImage = Boolean(image);
  const titleSize = title.length > 60 ? 50 : title.length > 34 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          backgroundImage: "linear-gradient(rgba(34,34,34,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,34,34,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          fontFamily: "Poppins",
          color: INK,
          position: "relative"
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: ACCENT, display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 64px 56px 78px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width={44} height={39} viewBox={LOGO_VIEWBOX}>
              <path d={LOGO_PATH} fill={INK} />
            </svg>
            <span style={{ fontFamily: "Newsreader", fontSize: 28, fontWeight: 600 }}>{profile.name}</span>
            <span style={{ marginLeft: 8, fontSize: 17, fontWeight: 500, letterSpacing: 3, color: ACCENT, textTransform: "uppercase" }}>{kind}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontFamily: "Newsreader", fontSize: titleSize, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1, display: "flex" }}>{clamp(title, 90)}</div>
            {subtitle && <div style={{ fontSize: 26, lineHeight: 1.45, color: MUTED, display: "flex" }}>{clamp(subtitle, hasImage ? 120 : 160)}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {tags.slice(0, hasImage ? 3 : 4).map(t => (
                <span key={t} style={{ fontSize: 18, padding: "5px 14px", border: "1.5px solid rgba(34,34,34,0.25)", background: "#ffffff", color: "#3a3a3a" }}>{t}</span>
              ))}
            </div>
            <span style={{ fontSize: 20, fontWeight: 500, color: ACCENT }}>{domain}</span>
          </div>
        </div>
        {hasImage && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: portrait ? 400 : 460, paddingRight: 64 }}>
            {portrait ? (
              <img src={image} width={320} height={320} style={{ borderRadius: 999, objectFit: "cover", border: `10px solid #ffffff`, boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }} />
            ) : (
              <img src={image} width={396} height={420} style={{ objectFit: "cover", border: "1.5px solid rgba(34,34,34,0.18)", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }} />
            )}
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts: fontData }
  );
}
