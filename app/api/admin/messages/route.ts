import { NextRequest, NextResponse } from "next/server";
import { adminGuard, failure } from "@/lib/api";
import { updateContact } from "@/lib/store";

export async function PATCH(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    const { id, read, remove } = (await req.json().catch(() => ({}))) as { id?: unknown; read?: unknown; remove?: unknown };
    if (typeof id !== "string" || id.length > 64) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await updateContact(id, { read: read !== false, remove: remove === true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
