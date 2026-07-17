// Who may log in to the admin area. Two gates: the address must be a
// tihlde.org address, and it must be on the admin list. The list lives on the
// volume as admins.json (editable without a redeploy); if that file does not
// exist the ADMIN_EMAILS env var (comma-separated) is used instead. Neither
// is ever committed to the repo.

import { readJson } from "@/lib/data-store";

const DOMAIN = "@tihlde.org";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function admins(): string[] {
  try {
    const list = readJson<string[]>("admins");
    if (Array.isArray(list)) return list.map(normalizeEmail);
  } catch {
    // no admins.json on the volume; fall through to the env var
  }
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAllowedEmail(email: string): boolean {
  const norm = normalizeEmail(email);
  return norm.endsWith(DOMAIN) && admins().includes(norm);
}
