"use client";
import { useRef, useState } from "react";
import { ImagePlus, Link2, Trash2, Upload } from "lucide-react";

/** Starter ```flow block inserted by the editors' "Flowchart" buttons. */
export const FLOW_TEMPLATE = "\n```flow\ntitle: High-level flow\nlanes: 01 / User | 02 / Web app | 03 / Storage\nuser: User / browser @1 input\napp: Web app / Next.js @2\ndb: Database / MongoDB @3 store\nuser -> app: request\napp ..> db: save\n```\n";

export async function api<T = Record<string, unknown>>(url: string, method = "GET", body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) {
    location.href = "/admin/login";
    throw new Error("Session expired — please sign in again.");
  }
  if (!r.ok) throw new Error((d as { error?: string }).error || `Request failed (${r.status})`);
  return d as T;
}

/** Resizes and re-encodes an image in the browser so uploads stay small (WebP, max 1600px wide). */
export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
  if (!/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.type)) throw new Error("Use a PNG, JPG, WebP, GIF or AVIF image.");
  if (file.size > 15 * 1024 * 1024) throw new Error("That image is over 15 MB — please choose a smaller one.");
  if (file.type === "image/gif") {
    if (file.size > 2.4 * 1024 * 1024) throw new Error("GIFs must be under 2.4 MB.");
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = () => rej(new Error("Could not read the file."));
      fr.readAsDataURL(file);
    });
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let url = canvas.toDataURL("image/webp", quality);
  if (!url.startsWith("data:image/webp")) url = canvas.toDataURL("image/jpeg", quality);
  if (url.length > 3_400_000) throw new Error("Image is still too large after compression.");
  return url;
}

export function ImageField({ label, value, onChange, hint, fallback }: { label: string; value: string; onChange: (v: string) => void; hint?: string; fallback?: React.ReactNode }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isData = value.startsWith("data:");

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await compressImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="image-picker">
        <div
          className="image-preview"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
        >
          {value ? <img src={value} alt="" /> : fallback || <span><ImagePlus size={18} /></span>}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link2 size={15} className="muted" />
            <input
              value={isData ? "" : value}
              placeholder={isData ? "Uploaded image (stored with the post)" : "https://… image URL"}
              onChange={e => onChange(e.target.value)}
              style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", padding: "10px 12px", fontSize: 14, outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={busy}>
              <Upload size={13} /> {busy ? "Processing…" : "Upload image"}
            </button>
            {value && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange("")}><Trash2 size={13} /> Remove</button>}
          </div>
          <span className="hint">{hint || "Drag & drop, upload or paste a URL. Uploads are resized and converted to WebP automatically."}</span>
          {error && <span className="hint" style={{ color: "#c0392b" }}>{error}</span>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" hidden onChange={e => onFile(e.target.files?.[0])} />
    </div>
  );
}

export function Field({ label, hint, children, full }: { label: string; hint?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`field${full ? " full" : ""}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}
