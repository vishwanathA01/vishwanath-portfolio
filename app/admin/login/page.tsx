"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import Logo from "@/components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Login failed");
      location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-wrap">
      <div className="login-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 34 }}>
          <Logo size={36} />
          <Link href="/" className="eyebrow plain" style={{ gap: 6 }}><ArrowLeft size={13} /> Back to site</Link>
        </div>
        <div className="eyebrow">Private area</div>
        <h1 style={{ fontSize: 36, letterSpacing: "-0.05em", margin: "12px 0 26px" }}>Admin sign in.</h1>
        <form onSubmit={submit} className="form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn" disabled={busy}><Lock size={14} /> {busy ? "Verifying…" : "Sign in"}</button>
          {error && <div className="notice err" role="alert">{error}</div>}
        </form>
      </div>
    </main>
  );
}
