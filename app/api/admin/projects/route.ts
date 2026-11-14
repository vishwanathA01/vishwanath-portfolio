import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminGuard, failure, firstIssue } from "@/lib/api";
import { deleteProject, listProjects, saveProject } from "@/lib/store";
import type { Motif } from "@/lib/types";
import { projectSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    return NextResponse.json({ projects: await listProjects() });
  } catch (e) {
    return failure(e);
  }
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    const parsed = projectSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    const { originalSlug, ...data } = parsed.data;
    const project = await saveProject({ ...data, motif: data.motif as Motif }, originalSlug);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    return failure(e);
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    await deleteProject(slug);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
