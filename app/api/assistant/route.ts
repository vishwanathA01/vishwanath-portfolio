import { NextRequest, NextResponse } from "next/server";
import { sameOrigin } from "@/lib/api";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { journey, profile, skills } from "@/lib/data";
import { getPage, getSettings, listPosts, listProjects } from "@/lib/store";

/**
 * "Ask my AI" backend. Uses the Gemini Interactions API
 * (POST /v1beta/interactions) with a server-only key. The key never reaches the browser.
 */
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const DEFAULT_MODEL = "gemini-4-hydrogen";
const BUSY = "The AI is busy right now — please try again in a moment, or use the contact form.";

// Per-IP limit so a public endpoint can't burn through the API quota.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

type Step = { type?: string; content?: { type?: string; text?: string }[] };

function extractText(data: { output_text?: string; steps?: Step[] }) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  return (data.steps || [])
    .filter(s => s.type === "model_output")
    .flatMap(s => s.content || [])
    .map(c => (c.type === "text" || c.text ? c.text || "" : ""))
    .join("")
    .trim();
}

async function ask(key: string, model: string, system: string, question: string, timeoutMs: number) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      model,
      system_instruction: system,
      input: question,
      store: false,
      generation_config: { temperature: 0.3, max_output_tokens: 1500, thinking_level: "low" }
    }),
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store"
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`[assistant] Gemini ${model} HTTP ${response.status}: ${detail.slice(0, 300)}`);
    return { ok: false as const, status: response.status };
  }
  return { ok: true as const, text: extractText(await response.json()) };
}

export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
    if (rateLimited(`assistant:${clientIp(req)}`, MAX_PER_WINDOW, WINDOW_MS)) return NextResponse.json({ error: "You’re asking a lot at once — please wait a minute and try again." }, { status: 429 });

    const body = await req.json().catch(() => ({}));
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 1000) : "";
    if (question.length < 2) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json({
        answer: `I’m running in demo mode right now. ${profile.firstName} is a ${profile.education.year} B.Tech Computer Science student building full-stack and AI projects — have a look at the Projects and Blog pages, or use the contact form to reach out directly.`
      });
    }

    const [projects, posts, settings, now] = await Promise.all([listProjects(), listPosts(), getSettings(), getPage("now")]);
    const context = JSON.stringify({
      profile,
      contact: { email: settings.email, linkedin: settings.linkedin, location: settings.location, openToWork: settings.available },
      skills,
      journey,
      currentFocus: now.content.slice(0, 2000),
      projects: projects.map(p => ({ name: p.name, tagline: p.tagline, description: p.description, problem: p.problem, outcome: p.outcome, stack: p.stack, status: p.status, year: p.year, features: p.features, link: p.link, github: p.github })),
      articles: posts.map(p => ({ title: p.title, excerpt: p.excerpt }))
    });
    const system = `You are the portfolio assistant for ${profile.name}. Answer only questions about this person's profile, education, skills, projects, articles and career interests. Refer to ${profile.firstName} by name in the third person, in a friendly tone. Be concise (under 120 words), factual and professional. Use plain text, no markdown headings. Never invent work history, metrics, links, clients or achievements. If information is unavailable, say so and suggest the contact form. If asked about something unrelated, politely steer back to ${profile.firstName}'s work. Context: ${context}`;

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    let result = await ask(key, model, system, question, 30_000);
    // One retry for transient overload / rate-limit responses.
    if (!result.ok && [429, 500, 503, 504].includes(result.status)) {
      await new Promise(r => setTimeout(r, 1200));
      result = await ask(key, model, system, question, 25_000);
    }
    if (!result.ok) return NextResponse.json({ error: BUSY }, { status: 502 });
    return NextResponse.json({ answer: result.text || "I couldn't find an answer to that — try the contact form." });
  } catch (e) {
    const timedOut = e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError");
    console.error("[assistant]", timedOut ? "Gemini request timed out" : e);
    return NextResponse.json({ error: timedOut ? BUSY : "Unable to process that question." }, { status: timedOut ? 504 : 500 });
  }
}
