// Server-only helpers. Portraits follow a file convention so maintainers
// just drop an image into public/members/ named after the member id in
// members.json, e.g. public/members/kaja-saetherhaug-dalamo.jpg.
// An explicit image URL in members.json wins over the convention.

import fs from "fs";
import path from "path";
import type { Member } from "@/data/members";

const MEMBERS_DIR = path.join(process.cwd(), "public", "members");
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function findLocalImage(id: string): string {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(MEMBERS_DIR, id + ext))) {
      return `/members/${id}${ext}`;
    }
  }
  return "";
}

export function withImages(members: Member[]): Member[] {
  return members.map((m) =>
    m.image ? m : { ...m, image: findLocalImage(m.id) },
  );
}

// All group photos for the carousel: group.jpg first, then group-2.jpg,
// group-3.jpg and so on, sorted by name. Falls back to the single image.
export function resolveGroupImages(fallback: string): string[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(MEMBERS_DIR);
  } catch {
    return fallback ? [fallback] : [];
  }
  const images = files
    .filter((f) => /^group(-\d+)?\.(jpg|jpeg|png|webp)$/i.test(f))
    // group.jpg first, then group-2, group-3, ...
    .sort((a, b) => {
      const num = (f: string) => {
        const m = f.match(/^group-(\d+)\./i);
        return m ? parseInt(m[1], 10) : 1;
      };
      return num(a) - num(b);
    })
    .map((f) => `/members/${f}`);
  if (images.length > 0) return images;
  return fallback ? [fallback] : [];
}
