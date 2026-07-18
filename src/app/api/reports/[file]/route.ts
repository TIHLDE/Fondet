import fs from "fs";
import path from "path";
import { getDataDir } from "@/lib/data-store";

// Serves PDFs uploaded through the admin area from the volume. Committed
// reports under public/reports are served statically and never hit this route.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const safe = path.basename(file);
  if (!/^[a-z0-9._-]+\.pdf$/i.test(safe)) {
    return new Response("Not found", { status: 404 });
  }

  const dir = path.join(getDataDir(), "reports");
  const full = path.join(dir, safe);
  if (!full.startsWith(path.resolve(dir)) || !fs.existsSync(full)) {
    return new Response("Not found", { status: 404 });
  }
  const data = await fs.promises.readFile(full);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safe}"`,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
