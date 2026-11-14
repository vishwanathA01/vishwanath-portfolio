"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock, ExternalLink, X } from "lucide-react";

/**
 * "Schedule a call" button. With a booking link (Cal.com, Calendly, …) it opens the scheduler
 * in an in-page dialog; without one it falls back to a normal link (e.g. the contact form).
 */
export default function BookingButton({
  booking,
  fallbackHref = "/contact",
  label = "Schedule a call",
  fallbackLabel = "Tell me about your idea",
  className = "btn",
  style
}: {
  booking: string;
  fallbackHref?: string;
  label?: string;
  fallbackLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!booking) {
    return (
      <a className={className} style={style} href={fallbackHref}>
        {fallbackLabel} <ArrowUpRight size={16} />
      </a>
    );
  }

  return (
    <>
      <button type="button" className={className} style={style} onClick={() => setOpen(true)}>
        <CalendarClock size={16} /> {label}
      </button>
      {open && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Schedule a call">
            <div className="modal-head">
              <span className="eyebrow"><CalendarClock size={13} /> Pick a time that works for you</span>
              <div style={{ display: "flex", gap: 8 }}>
                <a className="btn btn-ghost btn-sm" href={booking} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Open in new tab</a>
                <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close scheduler"><X size={16} /></button>
              </div>
            </div>
            <iframe src={booking} title="Booking calendar" loading="lazy" />
          </div>
        </div>
      )}
    </>
  );
}
