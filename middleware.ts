import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "./lib/auth";

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  const session = req.cookies.get(COOKIE_NAME)?.value;
  if (await verifySession(session)) return NextResponse.next();
  const url = new URL("/login", req.url);
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/admin/:path*"] };
