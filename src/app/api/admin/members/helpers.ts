import type { Member } from "@/data/members";

// Member ids follow the portrait file convention: lowercase ascii slug of the
// name, æøå transliterated (tri-tac-le, kaja-saetherhaug-dalamo).
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MAX_LEN = 200;
const STRING_KEYS = ["name", "role", "studie", "linkedin"] as const;
const YEAR_KEYS = ["startYear", "endYear"] as const;

// Picks the editable fields out of a request body. Unknown keys are dropped,
// so a payload can never set id or image directly. Returns an error message
// instead of a value when a present field has the wrong shape.
export function memberFields(
  body: unknown,
): { value: Partial<Member> } | { error: string } {
  const src = (body ?? {}) as Record<string, unknown>;
  const out: Partial<Member> = {};
  for (const key of STRING_KEYS) {
    const v = src[key];
    if (v === undefined || v === null) continue;
    if (typeof v !== "string" || v.length > MAX_LEN) {
      return { error: `Ugyldig verdi for ${key}` };
    }
    out[key] = v.trim();
  }
  for (const key of YEAR_KEYS) {
    const v = src[key];
    if (v === undefined || v === null || v === "") continue;
    const n = Number(v);
    if (!Number.isInteger(n) || n < 2000 || n > 2100) {
      return { error: `Ugyldig verdi for ${key}` };
    }
    out[key] = n;
  }
  return { value: out };
}
