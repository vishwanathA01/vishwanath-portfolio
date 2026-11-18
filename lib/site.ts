import { headers } from "next/headers";

/** Public origin of the site (no trailing slash): NEXT_PUBLIC_SITE_URL, else the request host. */
export async function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const h = await headers();
  return `${h.get("x-forwarded-proto") || "http"}://${h.get("x-forwarded-host") || h.get("host")}`;
}

export const feedPath = "/feed.xml";

/** Feedly's official subscribe link: /i/subscription/ + the URL-encoded feed id "feed/<feed url>". */
export const feedlyFollowUrl = (feedUrl: string) => `https://feedly.com/i/subscription/${encodeURIComponent(`feed/${feedUrl}`)}`;
