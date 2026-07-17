import fs from "fs";
import path from "path";
import sharp from "sharp";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { uploadImageDir } from "@/lib/member-images";

const MAX_BYTES = 10 * 1024 * 1024;

// group.jpg / group-2.jpg for the current carousel, group-2024-1.jpg style for
// the archive on the previous members page. Same convention as
// resolveGroupImages / resolveArchiveGroupImages.
const NAME = /^group(-[2-9]|-\d{4}-\d{1,2})?$/;
const FILE = /^group(-\d+|-\d{4}-\d{1,2})?\.(jpg|jpeg|png|webp)$/;

const REPO_DIR = path.join(process.cwd(), "public", "members");

type GroupImage = { file: string; url: string; source: "volume" | "repo" };

function list(dir: string, source: GroupImage["source"]): GroupImage[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => FILE.test(f))
    .sort()
    .map((f) => ({
      file: f,
      url: source === "repo" ? `/members/${f}` : `/api/members/${f}`,
      source,
    }));
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();
  const volume = list(uploadImageDir(), "volume");
  // repo copies shadowed by a volume file with the same name are dropped,
  // matching how the public pages resolve them
  const shadowed = new Set(volume.map((i) => i.file));
  const repo = list(REPO_DIR, "repo").filter((i) => !shadowed.has(i.file));
  return NextResponse.json({ images: [...volume, ...repo] });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const name = String(form?.get("name") ?? "").trim();
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Mangler fil" }, { status: 400 });
  }
  if (!NAME.test(name)) {
    return NextResponse.json(
      {
        error:
          "Ugyldig navn. Bruk group, group-2 ... group-9, eller group-ÅÅÅÅ-N for arkivbilder",
      },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Bildet er for stort (maks 10 MB)" },
      { status: 400 },
    );
  }

  let processed: Buffer;
  try {
    processed = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Filen er ikke et gyldig bilde" },
      { status: 400 },
    );
  }

  const dir = uploadImageDir();
  fs.mkdirSync(dir, { recursive: true });
  for (const ext of [".jpeg", ".png", ".webp"]) {
    fs.rmSync(path.join(dir, name + ext), { force: true });
  }
  fs.writeFileSync(path.join(dir, name + ".jpg"), processed);
  return NextResponse.json({
    file: `${name}.jpg`,
    url: `/api/members/${name}.jpg`,
  });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();

  let file = "";
  try {
    const body = await request.json();
    file = path.basename(String(body?.file ?? ""));
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }
  if (!FILE.test(file)) {
    return NextResponse.json({ error: "Ugyldig filnavn" }, { status: 400 });
  }

  const full = path.join(uploadImageDir(), file);
  if (fs.existsSync(full)) {
    fs.rmSync(full);
    return NextResponse.json({ ok: true });
  }
  if (fs.existsSync(path.join(REPO_DIR, file))) {
    return NextResponse.json(
      { error: "Bildet ligger i repoet og kan bare fjernes derfra" },
      { status: 409 },
    );
  }
  return NextResponse.json({ error: "Fant ikke bildet" }, { status: 404 });
}
