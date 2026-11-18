import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import FeedlyButton from "@/components/site/FeedlyButton";
import JsonLd from "@/components/site/JsonLd";
import ShareButton from "@/components/site/ShareButton";
import { profile } from "@/lib/data";
import { Markdown, tableOfContents } from "@/lib/markdown";
import { formatDate, postCover, readingTime } from "@/lib/media";
import { feedPath, siteOrigin } from "@/lib/site";
import { listPosts } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await listPosts().catch(() => [])).find(p => p.slug === slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, modifiedTime: post.updatedAt, tags: post.tags }
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await listPosts().catch(() => []);
  const idx = posts.findIndex(p => p.slug === slug);
  if (idx < 0) notFound();
  const post = posts[idx];
  const newer = posts[idx - 1];
  const older = posts[idx + 1];
  const toc = tableOfContents(post.content);
  const cover = postCover(post);
  const origin = await siteOrigin();
  const feedUrl = `${origin}${feedPath}`;

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.updatedAt,
          author: { "@type": "Person", name: profile.name, url: origin },
          mainEntityOfPage: `${origin}/blog/${post.slug}`,
          keywords: post.tags.join(", "),
          wordCount: post.content.split(/\s+/).filter(Boolean).length
        }}
      />
      <header className="shell page-head">
        <div className="crumbs"><Link href="/">Home</Link> <span>/</span> <Link href="/blog">Writing</Link> <span>/</span> <span>{post.title}</span></div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="intro-copy">{post.excerpt}</p>}
        <div className="article-meta">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Logo size={16} /> {profile.name}</span>
          <time dateTime={post.date}>{formatDate(post.date, { day: "numeric", month: "long", year: "numeric" })}</time>
          <span>{readingTime(post.content)} min read</span>
          {post.tags.map(t => <span key={t}>#{t}</span>)}
        </div>
      </header>

      {cover && (
        <div className="shell" style={{ marginBottom: 60 }}>
          <div className="project-hero"><img src={cover} alt="" /></div>
        </div>
      )}

      <div className="shell article-grid">
        <aside>
          {toc.length > 1 && (
            <nav className="toc" aria-label="On this page">
              <div className="eyebrow plain" style={{ marginBottom: 8 }}>On this page</div>
              {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.text}</a>)}
            </nav>
          )}
        </aside>
        <div>
          <Markdown source={post.content} />
          <div className="split-rule" style={{ margin: "60px 0 24px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div className="tags">{post.tags.map(t => <Link key={t} href="/blog" className="tag">#{t}</Link>)}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <FeedlyButton feedUrl={feedUrl} />
              <ShareButton title={post.title} />
            </div>
          </div>
        </div>
      </div>

      {(newer || older) && (
        <nav className="shell pager" aria-label="More articles">
          {older ? (
            <Link href={`/blog/${older.slug}`}>
              <span className="eyebrow plain"><ArrowLeft size={13} /> Older</span>
              <strong>{older.title}</strong>
            </Link>
          ) : <span />}
          {newer ? (
            <Link href={`/blog/${newer.slug}`}>
              <span className="eyebrow plain" style={{ justifyContent: "flex-end" }}>Newer <ArrowRight size={13} /></span>
              <strong>{newer.title}</strong>
            </Link>
          ) : <span />}
        </nav>
      )}
    </article>
  );
}
