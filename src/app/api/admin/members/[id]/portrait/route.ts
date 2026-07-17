import fs from "fs";
import path from "path";
import sharp from "sharp";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson } from "@/lib/data-store";
import type { MembersFile } from "@/data/members";
import { IMAGE_EXTENSIONS, uploadImageDir } from "@/lib/member-images";

const MAX_BYTES = 5 * 1024 * 1024;

type Params = { params: { id: string } };

function knownMember(id: string): boolean {
  const data = readJson<MembersFile>("members");
  return [...data.allMembers, ...data.previousMembers].some((m) => m.id === id);
}

// Uploads land as <id>.jpg in the volume dir; sharp decoding doubles as the
// file type check and strips whatever metadata the original carried.
export async function POST(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();
  const id = params.id;
  if (!/^[a-z0-9-]+$/.test(id) || !knownMember(id)) {
    return NextResponse.json({ error: "Fant ikke medlemmet" }, { status: 404 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Mangler fil" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Bildet er for stort (maks 5 MB)" },
      { status: 400 },
    );
  }

  let processed: Buffer;
  try {
    processed = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
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
  // drop stale copies in other formats so the new jpg is the one that resolves
  for (const ext of IMAGE_EXTENSIONS) {
    if (ext !== ".jpg") fs.rmSync(path.join(dir, id + ext), { force: true });
  }
  fs.writeFileSync(path.join(dir, id + ".jpg"), processed);
  return NextResponse.json({ image: `/api/members/${id}.jpg` });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();
  const id = params.id;
  if (!/^[a-z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: "Ugyldig id" }, { status: 400 });
  }

  const dir = uploadImageDir();
  let removed = false;
  for (const ext of IMAGE_EXTENSIONS) {
    const full = path.join(dir, id + ext);
    if (fs.existsSync(full)) {
      fs.rmSync(full);
      removed = true;
    }
  }
  if (removed) return NextResponse.json({ ok: true });

  const inRepo = IMAGE_EXTENSIONS.some((ext) =>
    fs.existsSync(path.join(process.cwd(), "public", "members", id + ext)),
  );
  if (inRepo) {
    return NextResponse.json(
      { error: "Portrettet ligger i repoet og kan bare fjernes derfra" },
      { status: 409 },
    );
  }
  return NextResponse.json({ error: "Fant ikke noe portrett" }, { status: 404 });
}
