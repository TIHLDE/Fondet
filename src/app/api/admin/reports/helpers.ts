export interface ReportEntry {
  title: string;
  url: string;
  type: string;
}

export interface ContentFile {
  reports: ReportEntry[];
}

// Validates a full or partial report entry from a request body.
export function reportFields(
  body: unknown,
): { value: Partial<ReportEntry> } | { error: string } {
  const src = (body ?? {}) as Record<string, unknown>;
  const out: Partial<ReportEntry> = {};
  for (const key of ["title", "url", "type"] as const) {
    const v = src[key];
    if (v === undefined || v === null) continue;
    if (typeof v !== "string" || v.length > 500) {
      return { error: `Ugyldig verdi for ${key}` };
    }
    out[key] = v.trim();
  }
  if (out.url && !/^(https:\/\/|\/)/.test(out.url)) {
    return { error: "Lenken må starte med https:// eller /" };
  }
  return { value: out };
}
