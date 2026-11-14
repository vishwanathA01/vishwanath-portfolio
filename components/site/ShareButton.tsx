"use client";
import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }
    } catch {
      /* user cancelled the share sheet */
    }
  }
  return (
    <button className="btn btn-ghost btn-sm" onClick={share}>
      {done ? <><Check size={13} /> Link copied</> : <><Share2 size={13} /> Share article</>}
    </button>
  );
}
