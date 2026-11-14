import Link from "next/link";

/** Cross-links shown at the bottom of subpages. */
export default function MoreLinks({ current }: { current?: "about" | "now" | "contact" }) {
  const links = [
    { key: "about", href: "/about", text: "who I am" },
    { key: "now", href: "/now", text: "what I’m focused on now" },
    { key: "contact", href: "/contact", text: "how to work with me" }
  ].filter(l => l.key !== current);
  return (
    <div className="shell more-links">
      More on{" "}
      {links.map((l, i) => (
        <span key={l.key}>
          <Link href={l.href}>{l.text}</Link>
          {i < links.length - 2 ? ", " : i === links.length - 2 ? ", or " : "."}
        </span>
      ))}
    </div>
  );
}
