import { NextResponse } from "next/server";
import { getPost, getProject } from "@/lib/store";

/** Serves images that were uploaded through the admin panel (stored inline as data URLs). */
export async function GET(req: Request, { params: paramsPromise }: { params: Promise<{ kind: string; slug: string; name: string }> }) {
  const params = await paramsPromise;
  let value = "";
  if (params.kind === "projects") {
    const p = await getProject(params.slug).catch(() => null);
    if (p) value = params.name === "cover" ? p.image : p.gallery[Number(params.name)] || "";
  } else if (params.kind === "posts" && params.name === "cover") {
    value = (await getPost(params.slug).catch(() => null))?.cover || "";
  }
  if (!value) return new NextResponse("Not found", { status: 404 });
  if (!value.startsWith("data:")) return NextResponse.redirect(new URL(value, req.url));

  const m = value.match(/^data:(image\/[a-z+.-]+);base64,(.+)$/i);
  if (!m) return new NextResponse("Not found", { status: 404 });
  const versioned = new URL(req.url).searchParams.has("v");
  return new NextResponse(Buffer.from(m[2], "base64"), {
    headers: {
      "Content-Type": m[1],
      "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "public, max-age=300",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
