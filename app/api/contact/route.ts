import { NextRequest, NextResponse } from "next/server";
import { failure } from "@/lib/api";
import { addContact } from "@/lib/store";
import { contactSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const parsed = contactSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    await addContact(parsed.data, ip);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
