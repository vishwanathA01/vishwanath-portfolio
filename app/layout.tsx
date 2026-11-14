import type { Metadata, Viewport } from "next";
import { Newsreader, Poppins } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500", "600"], style: ["normal", "italic"], adjustFontFallback: false });
const sans = Poppins({ subsets: ["latin"], variable: "--font-sans", display: "swap", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${profile.name} — ${profile.shortRole}`, template: `%s — ${profile.name}` },
  description: profile.summary,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  manifest: "/manifest.webmanifest",
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: `${profile.name} — Blog` }] } },
  openGraph: { title: `${profile.name} — Portfolio`, description: profile.summary, type: "website", siteName: profile.name, images: [{ url: "/profile.jpg", width: 800, height: 800, alt: profile.name }] },
  twitter: { card: "summary", title: `${profile.name} — Portfolio`, description: profile.summary, images: ["/profile.jpg"] }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" }
  ]
};

/** Runs before paint: applies the saved theme and plays the intro only once per browser session. */
const bootScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('theme');d.dataset.theme=t==='dark'?'dark':'light';if(location.pathname.indexOf('/admin')===0)return;if(sessionStorage.getItem('intro-seen'))d.dataset.intro='seen';else sessionStorage.setItem('intro-seen','1')}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
