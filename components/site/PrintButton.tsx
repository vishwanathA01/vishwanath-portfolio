"use client";
import { Printer } from "lucide-react";

/** Opens the print dialog — choose "Save as PDF" to download the résumé. */
export default function PrintButton({ label = "Save as PDF" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-sm" onClick={() => window.print()}>
      <Printer size={14} /> {label}
    </button>
  );
}
