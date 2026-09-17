import { NextResponse } from "next/server";
import { COOKIE_NAME } from "../../../lib/auth";
export async function POST() {
  const r = NextResponse.json({ ok: true });
  r.cookies.set(COOKIE_NAME, "", { httpOnly: true, expires: new Date(0), path: "/" });
  return r;
}
