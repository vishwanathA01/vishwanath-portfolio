import { promises as fs } from "fs";
import path from "path";

/** Returns the URL of public/profile.(jpg|jpeg|png|webp) if it exists, otherwise "". */
export async function findPortrait() {
  for (const name of ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp"]) {
    if (await fs.stat(path.join(process.cwd(), "public", name)).then(() => true, () => false)) return `/${name}`;
  }
  return "";
}

/** Real project logos live at public/projects/<slug>/logo.(png|svg|jpg|webp). Returns slug → URL. */
export async function findProjectLogos(slugs: string[]) {
  const entries = await Promise.all(
    slugs.map(async slug => {
      for (const ext of ["png", "svg", "jpg", "webp"]) {
        const rel = `projects/${slug}/logo.${ext}`;
        if (await fs.stat(path.join(process.cwd(), "public", rel)).then(() => true, () => false)) return [slug, `/${rel}`] as const;
      }
      return [slug, ""] as const;
    })
  );
  return Object.fromEntries(entries) as Record<string, string>;
}
