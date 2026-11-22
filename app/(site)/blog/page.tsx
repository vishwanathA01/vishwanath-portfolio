import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";
import FeedlyButton from "@/components/site/FeedlyButton";
import PostList from "@/components/site/PostList";
import { toPostCard } from "@/lib/media";
import { feedPath, siteOrigin } from "@/lib/site";
import { listPosts } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog", description: "Articles by Vishwanath Thakur on building, design and engineering." };

export default async function BlogPage() {
  const posts = await listPosts().catch(() => []);
  const feedUrl = `${await siteOrigin()}${feedPath}`;
  return (
    <>
      <section className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <span>Writing</span></div>
        <div className="meta-line"><span>Essays &amp; notes</span> <a className="rss-link" href="/rss" aria-label="Subscribe via RSS" title="Subscribe via RSS"><Rss size={11} /></a></div>
        <h1>Writing</h1>
        <p className="intro-copy">Writing about what I’m building, designing and learning as a computer-science student — practical, honest and occasionally opinionated.</p>
        <div className="hero-actions" style={{ marginTop: 22, gap: 12 }}>
          <FeedlyButton feedUrl={feedUrl} />
          <Link className="btn btn-ghost btn-sm" href="/rss"><Rss size={13} /> Other RSS readers</Link>
        </div>
      </section>
      <section className="shell" style={{ paddingBottom: 120 }}>
        <PostList posts={posts.map(toPostCard)} />
      </section>
    </>
  );
}
