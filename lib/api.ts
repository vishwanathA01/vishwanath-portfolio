import { NextResponse } from "next/server";
import { isAdmin } from "./auth";
import { StoreError } from "./store";

/** Rejects cross-site browser requests (defence in depth on top of SameSite=strict cookies). */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") || req.headers.get("host"));
  } catch {
    return false;
  }
}

/** Returns an error response when the caller is not an authenticated admin, otherwise null. */
export async function adminGuard(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export function failure(e: unknown) {
  if (e instanceof StoreError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export function firstIssue(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const issue = error.issues[0];
  return issue ? `${issue.path.map(String).join(".") || "Input"}: ${issue.message}` : "Invalid input";
}
