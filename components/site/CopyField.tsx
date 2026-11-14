"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  }
  return (
    <div className="copy-field">
      <code>{value}</code>
      <button type="button" className="btn btn-sm" onClick={copy} aria-live="polite">
        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
      </button>
    </div>
  );
}
