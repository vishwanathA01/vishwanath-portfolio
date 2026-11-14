import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import BookingButton from "@/components/site/BookingButton";
import MoreLinks from "@/components/site/MoreLinks";
import { profile } from "@/lib/data";
import { Markdown } from "@/lib/markdown";
import { formatDate } from "@/lib/media";
import { getPage, getPublicSettings } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Now", description: `What ${profile.name} is focused on right now.` };

export default async function NowPage() {
  const [page, settings] = await Promise.all([getPage("now"), getPublicSettings()]);
  return (
    <>
      <section className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <span>Now</span></div>
        <h1>{page.title}<em>.</em></h1>
        {page.intro && <p className="intro-copy">{page.intro}</p>}
        <p className="updated" style={{ marginTop: 22 }}><Clock size={13} /> Updated {formatDate(page.updatedAt, { month: "long", year: "numeric" })}</p>
      </section>
      <div className="shell md-page">
        <div data-reveal><Markdown source={page.content} /></div>
        <aside className="md-side">
          <div className="side-box">
            <span className="eyebrow">Status</span>
            <h4>{settings.available ? "Open to internships & collaborations" : "Focused on studies right now"}</h4>
            <p>Based in {settings.location}. Happy to work remotely or on-site.</p>
            <Link className="btn btn-sm" href="/contact">How to reach me <ArrowUpRight size={14} /></Link>
            {settings.booking && <BookingButton booking={settings.booking} className="btn btn-ghost btn-sm" />}
          </div>
          <div className="side-box">
            <span className="eyebrow">What is a /now page?</span>
            <p>A snapshot of what someone is focused on at this point in their life — a lighter, more honest alternative to a CV.</p>
          </div>
        </aside>
      </div>
      <MoreLinks current="now" />
    </>
  );
}
