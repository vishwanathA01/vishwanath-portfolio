import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="login-wrap">
      <div style={{ textAlign: "center", display: "grid", justifyItems: "center", gap: 20, background: "var(--bg)", padding: "48px 40px", border: "1px solid var(--line)" }}>
        <Logo size={64} />
        <div className="eyebrow plain">Error 404</div>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", letterSpacing: "-0.05em" }}>Page not found.</h1>
        <p className="muted" style={{ maxWidth: 360 }}>The page you’re looking for doesn’t exist or has moved.</p>
        <Link className="btn" href="/"><ArrowLeft size={14} /> Back to home</Link>
      </div>
    </main>
  );
}
