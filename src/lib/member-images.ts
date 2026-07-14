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

// Group photo convention: public/members/group.jpg (or .jpeg/.png/.webp).
// Falls back to the groupImage URL in members.json.
export function resolveGroupImage(fallback: string): string {
  return findLocalImage("group") || fallback;
}
