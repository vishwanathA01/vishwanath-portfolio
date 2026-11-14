import { NextRequest, NextResponse } from "next/server";
import { journey, profile, skills } from "@/lib/data";
import { getPage, getSettings, listPosts, listProjects } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
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
      projects: projects.map(p => ({ name: p.name, tagline: p.tagline, description: p.description, problem: p.problem, outcome: p.outcome, stack: p.stack, status: p.status, year: p.year, features: p.features })),
      articles: posts.map(p => ({ title: p.title, excerpt: p.excerpt }))
    });
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `You are the portfolio assistant for ${profile.name}. Answer only questions about this person's profile, education, skills, projects, articles and career interests. Refer to ${profile.firstName} by name in the third person, in a friendly tone. Be concise (under 120 words), factual and professional. Never invent work history, metrics, links, clients or achievements. If information is unavailable, say so and suggest the contact form. Context: ${context}`
          }]
        },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 350 }
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return NextResponse.json({ error: "The assistant is temporarily unavailable." }, { status: 502 });
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "I couldn't find an answer to that.";
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Unable to process that question." }, { status: 500 });
  }
}
