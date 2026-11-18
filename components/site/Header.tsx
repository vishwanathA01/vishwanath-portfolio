"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Moon, Search, Sun, X } from "lucide-react";
import { currentTheme, toggleTheme, type Theme } from "@/lib/theme";

export const NAV = [
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/blog" },
  { label: "Now", href: "/now" },
  { label: "About", href: "/about" },
  { label: "Résumé", href: "/resume" },
  { label: "Contact", href: "/contact" }
];

export function ThemeButton() {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    setThemeState(currentTheme());
    const on = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return (
    <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Toggle theme">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default function Header({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const isCurrent = (href: string) => href !== "/" && pathname.startsWith(href);

  return (
    <header className="header" data-scrolled={scrolled || open} style={{ viewTransitionName: "site-header" }}>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${name} — home`}>
          <span>
            <span className="brand-name">{name}</span>
            <small>{role}</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="kbd-btn" onClick={() => window.dispatchEvent(new Event("open-palette"))} aria-label="Search and quick navigation">
            <Search size={15} />
            <kbd>⌘K</kbd>
          </button>
          <ThemeButton />
          <Link href="/contact" className="header-cta">Let’s talk <ArrowUpRight size={15} /></Link>
          <button className="icon-btn menu-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" hidden={!open} aria-label="Mobile">
        {[{ label: "Home", href: "/" }, ...NAV].map(item => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
