import { Rss } from "lucide-react";
import { feedlyFollowUrl } from "@/lib/site";

/** "Follow on Feedly" link for the site's RSS feed. */
export default function FeedlyButton({ feedUrl, variant = "ghost", label = "Follow on Feedly" }: { feedUrl: string; variant?: "solid" | "ghost"; label?: string }) {
  return (
    <a
      className={`btn btn-sm${variant === "ghost" ? " btn-ghost" : ""}`}
      href={feedlyFollowUrl(feedUrl)}
      target="_blank"
      rel="noopener noreferrer"
      title="Follow new posts in Feedly"
    >
      <Rss size={13} /> {label}
    </a>
  );
}
