import fs from "fs";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { getDataDir } from "@/lib/data-store";
import { slugify } from "../../members/helpers";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Mangler fil" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Filen er for stor (maks 10 MB)" },
      { status: 400 },
    );
  }

  const stem = slugify(path.basename(file.name).replace(/\.pdf$/i, ""));
  if (!stem) {
    return NextResponse.json({ error: "Ugyldig filnavn" }, { status: 400 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  if (!data.subarray(0, 5).toString("latin1").startsWith("%PDF-")) {
    return NextResponse.json(
      { error: "Filen er ikke en gyldig PDF" },
      { status: 400 },
    );
  }

  const dir = path.join(getDataDir(), "reports");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${stem}.pdf`), data);
  return NextResponse.json({ url: `/api/reports/${stem}.pdf` });
}
