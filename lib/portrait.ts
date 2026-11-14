import { promises as fs } from "fs";
import path from "path";

/** Returns the URL of public/profile.(jpg|jpeg|png|webp) if it exists, otherwise "". */
export async function findPortrait() {
  for (const name of ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp"]) {
    if (await fs.stat(path.join(process.cwd(), "public", name)).then(() => true, () => false)) return `/${name}`;
  }
  return "";
}
