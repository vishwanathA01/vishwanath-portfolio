import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/api";
import { getRepos } from "@/lib/github";
import { getSettings } from "@/lib/store";

/** Lists public repositories for the project-import picker. ?username= overrides the saved username. */
export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const username = new URL(req.url).searchParams.get("username")?.trim() || (await getSettings()).githubUsername;
  if (!username) return NextResponse.json({ error: "Add your GitHub username first." }, { status: 400 });
  const repos = await getRepos(username);
  if (!repos) return NextResponse.json({ error: `Couldn't load repositories for “${username}”. Check the username, or try again in a minute (GitHub rate limit).` }, { status: 502 });
  return NextResponse.json({
    username,
    repos: repos.map(r => ({
      name: r.name,
      description: r.description || "",
      url: r.html_url,
      homepage: r.homepage || "",
      language: r.language || "",
      topics: r.topics || [],
      stars: r.stargazers_count,
      pushed: r.pushed_at,
      created: r.created_at
    }))
  });
}
