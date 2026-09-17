import { NextResponse } from "next/server";
import { COOKIE_NAME, makeSession } from "../../../lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  // Local portfolio admin credentials requested by the owner.
  const adminEmail = "vishwanaththakur51@gmail.com";
  const adminPassword = "vishwanath12";

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, await makeSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
