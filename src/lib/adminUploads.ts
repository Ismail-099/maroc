import { readdir } from "node:fs/promises";
import path from "node:path";

export async function getUploads(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(dir);
    return files
      .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
      .map((f) => `/uploads/${f}`)
      .reverse();
  } catch {
    return [];
  }
}
