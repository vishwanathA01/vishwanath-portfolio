"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [showPassword,setShowPassword]=useState(false);

  async function login(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      if(r.ok) {
        const next = new URLSearchParams(window.location.search).get("next") || "/admin";
        router.replace(next);
      } else {
        let message = "Login failed. Please check your credentials.";
        try { const d=await r.json(); message=d.error||message; } catch {}
        setError(message);
        setBusy(false);
      }
    } catch {
      setError("Unable to connect to the authentication service.");
      setBusy(false);
    }
  }

  return <main className="loginPage">
    <div className="loginGrid"/>
    <div className="loginOrb loginOrbOne"/>
    <div className="loginOrb loginOrbTwo"/>
    <div className="loginDecor decorOne">VT / 01</div>
    <div className="loginDecor decorTwo">PORTFOLIO CONTROL</div>
    <section className="loginShell">
      <div className="loginVisual">
        <div className="visualTop"><span className="liveDot"/> PRIVATE ADMIN ACCESS</div>
        <div className="visualLogo">VT<span>.</span></div>
        <h2>Build. Create.<br/><em>Control your story.</em></h2>
        <p>Manage your portfolio, projects, skills, social presence and site content from one secure workspace.</p>
        <div className="visualStats"><div><b>01</b><span>SECURE SPACE</span></div><div><b>24/7</b><span>LOCAL ACCESS</span></div><div><b>∞</b><span>CREATIVE CONTROL</span></div></div>
        <div className="visualSignature">VISHWANTH THAKUR <span>•</span> ADMIN</div>
      </div>
      <form className="loginCard" onSubmit={login}>
        <div className="loginHeader"><div><p className="eyebrow">SECURE CONTROL CENTER</p><h1>Welcome back<span>.</span></h1></div><div className="lockBadge">⌁</div></div>
        <p className="loginIntro">Sign in to continue to your portfolio administration workspace.</p>
        <label>Email address<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" placeholder="Enter your admin email" required/></label>
        <label>Password<div className="passwordWrap"><input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?"text":"password"} autoComplete="current-password" placeholder="Enter your password" required/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?"◉":"◌"}</button></div></label>
        {error&&<div className="loginError"><span>!</span>{error}</div>}
        <button className="primary loginSubmit" disabled={busy}>{busy?<><span className="spinner"/>Authenticating…</>:<>Enter Admin Panel <span>→</span></>}</button>
        <div className="loginSecurity"><span>⌾</span><div><b>Protected session</b><small>Your credentials are verified securely before access is granted.</small></div></div>
        <a className="backHome" href="/">← Back to portfolio</a>
      </form>
    </section>
  </main>
}
