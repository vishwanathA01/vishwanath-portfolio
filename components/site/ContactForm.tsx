"use client";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

const empty = { name: "", email: "", subject: "", message: "" };
const TOPICS = ["Internship opportunity", "Project collaboration", "Freelance work", "Question about a project", "Just saying hello"];

export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not send message.");
      setStatus({ ok: true, text: "Thanks — your message is on its way. I’ll get back to you soon." });
      setForm(empty);
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="contact-card" data-reveal>
      <div className="contact-card-head">
        <span className="eyebrow">Let’s talk about your idea</span>
        <small>* Required</small>
      </div>
      <form className="form" onSubmit={submit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="c-name">Your name *</label>
            <input id="c-name" required minLength={2} maxLength={80} value={form.name} onChange={set("name")} placeholder="First and last name" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email address *</label>
            <input id="c-email" required type="email" maxLength={160} value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="c-subject">What do you have in mind?</label>
          <select id="c-subject" value={form.subject} onChange={set("subject")}>
            <option value="">Select a topic</option>
            {TOPICS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-message">A little about it *</label>
          <textarea id="c-message" required minLength={10} maxLength={3000} value={form.message} onChange={set("message")} placeholder="What are you working on? Share the details, timeline, and anything else I should know." />
        </div>
        <button className="btn btn-block" disabled={busy}>{busy ? "Sending…" : "Send my message"} <ArrowUpRight size={16} /></button>
        <p className="form-note">No spam, no mailing lists. Just a reply from me.</p>
        {status && <div className={`notice ${status.ok ? "ok" : "err"}`} role="status">{status.ok && <Check size={16} />}{status.text}</div>}
      </form>
    </div>
  );
}
