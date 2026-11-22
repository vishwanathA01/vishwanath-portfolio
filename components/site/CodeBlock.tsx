"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Fenced code block with a language label and a copy button. */
export default function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the code is still selectable */
    }
  }
  return (
    <div className="code-block">
      <div className="code-bar">
        <span>{lang || "code"}</span>
        <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy code"}>
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre data-lang={lang || undefined}><code>{code}</code></pre>
    </div>
  );
}
