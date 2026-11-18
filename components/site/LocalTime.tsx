"use client";
import { useEffect, useState } from "react";

/** Live local time for the site owner (IST), so visitors know when to expect a reply. */
export default function LocalTime({ timeZone = "Asia/Kolkata", label = "IST" }: { timeZone?: string; label?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return null;
  const time = now.toLocaleTimeString("en-IN", { timeZone, hour: "numeric", minute: "2-digit", hour12: true });
  const hour = Number(now.toLocaleString("en-GB", { timeZone, hour: "2-digit", hour12: false }));
  const awake = hour >= 8 && hour < 23;
  return (
    <span className="local-time" title={awake ? "Usually replies within a day" : "Probably asleep — replies in the morning"}>
      <i data-awake={awake} /> {time} {label}
    </span>
  );
}
