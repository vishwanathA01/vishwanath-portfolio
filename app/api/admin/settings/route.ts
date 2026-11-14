import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminGuard, failure, firstIssue } from "@/lib/api";
import { saveSettings } from "@/lib/store";
import { settingsSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    const settings = await saveSettings(parsed.data);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    return failure(e);
  }
}
