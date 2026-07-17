import fs from "fs";
import path from "path";
import { membersImageDirs } from "@/lib/member-images";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Serves member portraits and group photos from the configured image
// directories (a mounted volume in production, public/members otherwise).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const safe = path.basename(file);
  const ext = path.extname(safe).toLowerCase();
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });

  for (const dir of membersImageDirs()) {
    const full = path.join(dir, safe);
    if (!full.startsWith(path.resolve(dir))) continue;
    if (!fs.existsSync(full)) continue;
    const data = await fs.promises.readFile(full);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  }
  return new Response("Not found", { status: 404 });
}
