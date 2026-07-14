// Server-only helpers. Portraits and group photos are served at runtime via
// /api/members/<file>. In production MEMBERS_IMAGE_DIR points at a mounted
// volume so images live on the server, not in the repo or the built image;
// maintainers drop a file named after the member id in members.json, e.g.
// tri-tac-le.jpg. Unset (dev/CI) falls back to public/members, which is also
// searched second in production so already-committed portraits keep working.
// An explicit image URL in members.json always wins over this convention.

import fs from "fs";
import path from "path";
import type { Member } from "@/data/members";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Directories searched in order; the volume (if configured) overrides the
// repo copy, and the repo copy is the fallback.
export function membersImageDirs(): string[] {
  const dirs: string[] = [];
  if (process.env.MEMBERS_IMAGE_DIR) dirs.push(process.env.MEMBERS_IMAGE_DIR);
  dirs.push(path.join(process.cwd(), "public", "members"));
  return dirs;
}

function findLocalImage(id: string): string {
  for (const dir of membersImageDirs()) {
    for (const ext of EXTENSIONS) {
      if (fs.existsSync(path.join(dir, id + ext))) {
        return `/api/members/${id}${ext}`;
      }
    }
  }
  return "";
}

export function withImages(members: Member[]): Member[] {
  return members.map((m) =>
    m.image ? m : { ...m, image: findLocalImage(m.id) },
  );
}

function groupNumber(file: string): number {
  const m = file.match(/^group-(\d+)\./i);
  return m ? parseInt(m[1], 10) : 1;
}

// All group photos for the carousel: group.jpg first, then group-2.jpg,
// group-3.jpg and so on. Falls back to the single image.
export function resolveGroupImages(fallback: string): string[] {
  const byName = new Map<string, string>();
  for (const dir of membersImageDirs()) {
    let files: string[] = [];
    try {
      files = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const f of files) {
      if (/^group(-\d+)?\.(jpg|jpeg|png|webp)$/i.test(f) && !byName.has(f)) {
        byName.set(f, `/api/members/${f}`);
      }
    }
  }
  const images = Array.from(byName.keys())
    .sort((a, b) => groupNumber(a) - groupNumber(b))
    .map((f) => byName.get(f)!);
  if (images.length > 0) return images;
  return fallback ? [fallback] : [];
}
