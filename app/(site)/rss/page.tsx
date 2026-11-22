import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Rss } from "lucide-react";
import CopyField from "@/components/site/CopyField";
import FeedlyButton from "@/components/site/FeedlyButton";
import MoreLinks from "@/components/site/MoreLinks";
import { PostLines } from "@/components/site/PostList";
import { profile } from "@/lib/data";
import { toPostCard } from "@/lib/media";
import { listPosts } from "@/lib/store";
import { feedPath, siteOrigin } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Subscribe via RSS", description: `Follow new writing by ${profile.name} in your feed reader.` };

export default async function RssPage() {
  const feedUrl = `${await siteOrigin()}${feedPath}`;
  const posts = await listPosts().catch(() => []);
  const enc = encodeURIComponent(feedUrl);

  return (
    <>
      <section className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <Link href="/blog">Writing</Link> <span>/</span> <span>RSS</span></div>
        <div className="meta-line"><span>RSS feed</span> <span className="rss-link"><Rss size={11} /></span></div>
        <h1>Subscribe<em>.</em></h1>
        <p className="intro-copy">Get new posts in your feed reader — no email, no algorithm. Copy the feed address into any RSS reader, or use one of the shortcuts below.</p>
      </section>
      <div className="shell" style={{ paddingBottom: 30 }}>
        <div className="side-box" style={{ borderLeft: "3px solid var(--accent)" }}>
          <span className="eyebrow">Feed address</span>
          <CopyField value={feedUrl} />
          <div className="hero-actions" style={{ marginTop: 6 }}>
            <FeedlyButton feedUrl={feedUrl} variant="solid" />
            <a className="btn btn-ghost btn-sm" href={`https://www.inoreader.com/?add_feed=${enc}`} target="_blank" rel="noreferrer">Open in Inoreader <ExternalLink size={13} /></a>
            <a className="btn btn-ghost btn-sm" href="/feed.xml" target="_blank" rel="noreferrer">View raw feed <ExternalLink size={13} /></a>
          </div>
          <p style={{ marginTop: 6 }}>New to RSS? It’s a free, open way to follow websites: your reader checks this feed and shows new posts as they’re published.</p>
        </div>
      </div>
      {posts.length > 0 && (
        <section className="shell section" style={{ paddingTop: 30 }}>
          <div className="section-head">
            <h2 className="section-title" style={{ fontSize: 32 }}>Recent posts</h2>
            <Link className="link-arrow" href="/blog">All writing</Link>
          </div>
          <PostLines posts={posts.slice(0, 5).map(toPostCard)} />
        </section>
      )}
      <MoreLinks />
    </>
  );
}
