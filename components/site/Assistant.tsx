"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import Logo from "@/components/Logo";

type Msg = { from: "bot" | "me"; text: string };

const SUGGESTIONS = ["What are your strongest skills?", "Tell me about CareerConnect AI", "Are you open to internships?"];

export default function Assistant({ firstName }: { firstName: string }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<Msg[]>([{ from: "bot", text: `Hi! I’m ${firstName}’s portfolio assistant. Ask me about skills, projects, education or availability.` }]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log, open]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setQuestion("");
    setBusy(true);
    setLog(l => [...l, { from: "me", text: q }]);
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
      const d = await r.json();
      setLog(l => [...l, { from: "bot", text: d.answer || d.error || "I couldn’t answer that just now." }]);
    } catch {
      setLog(l => [...l, { from: "bot", text: "The assistant is unavailable right now — please use the contact form." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="assistant-fab" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Ask my AI assistant">
        {open ? <X size={15} /> : <Sparkles size={15} />} <span className="label">Ask my AI</span>
      </button>
      {open && (
        <div className="assistant" role="dialog" aria-label="Portfolio assistant">
          <div className="assistant-head">
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Logo size={20} />
              <strong style={{ fontSize: 14 }}>Portfolio assistant</strong>
            </span>
            <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={14} />
            </button>
          </div>
          <div className="assistant-log" ref={logRef} aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`bubble ${m.from}`}>{m.text}</div>
            ))}
            {busy && <div className="bubble bot muted">Thinking…</div>}
          </div>
          {log.length < 3 && (
            <div className="suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="tag chip" onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
          )}
          <form onSubmit={e => { e.preventDefault(); ask(question); }}>
            <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about my work…" aria-label="Your question" maxLength={500} />
            <button className="btn btn-sm" disabled={busy} aria-label="Send question"><Send size={14} /></button>
          </form>
        </div>
      )}
    </>
  );
}
