import { NextRequest, NextResponse } from "next/server";
import { sameOrigin } from "@/lib/api";
import { createSession, verifyAdmin } from "@/lib/auth";
import { clientIp, rateLimited, resetLimit } from "@/lib/rate-limit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60_000;

export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
    const key = `login:${clientIp(req)}`;
    if (rateLimited(key, MAX_ATTEMPTS, WINDOW_MS)) {
      return NextResponse.json({ error: "Too many login attempts. Try again in 15 minutes." }, { status: 429 });
    }
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string" || email.length > 160 || password.length > 200) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }
    if (!(await verifyAdmin(email, password))) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    resetLimit(key);
    await createSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }
}
