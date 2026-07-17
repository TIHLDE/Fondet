import type { Soknad } from "@/data/soknader";

const DATO = /^\d{2}\.\d{2}\.\d{4}$/;

function link(v: unknown): { label: string; url: string } | null {
  const src = (v ?? {}) as Record<string, unknown>;
  const label = typeof src.label === "string" ? src.label.trim() : "";
  const url = typeof src.url === "string" ? src.url.trim() : "";
  if (!label || label.length > 200 || url.length > 500) return null;
  if (url && !url.startsWith("https://")) return null;
  return { label, url };
}

// Validates a complete søknad row. Rows are small enough that partial
// updates just send the whole row back.
export function parseSoknad(body: unknown): Soknad | null {
  const src = (body ?? {}) as Record<string, unknown>;
  const hvem = typeof src.hvem === "string" ? src.hvem.trim() : "";
  const hva = typeof src.hva === "string" ? src.hva.trim() : "";
  const dato = typeof src.dato === "string" ? src.dato.trim() : "";
  const sokt = link(src.sokt);
  const resultat = link(src.resultat);
  const innvilget = (src.resultat as Record<string, unknown>)?.innvilget;
  if (!hvem || !hva || hvem.length > 200 || hva.length > 200) return null;
  if (!DATO.test(dato)) return null;
  if (!sokt || !resultat || typeof innvilget !== "boolean") return null;
  return { hvem, hva, dato, sokt, resultat: { ...resultat, innvilget } };
}

function datoValue(dato: string): number {
  const [d, m, y] = dato.split(".").map(Number);
  return y * 10000 + m * 100 + d;
}

export function sortByDatoDesc(rows: Soknad[]): Soknad[] {
  return [...rows].sort((a, b) => datoValue(b.dato) - datoValue(a.dato));
}
