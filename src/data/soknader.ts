// Rows live in soknader.json (volume-first via data-store, edited by the
// admin area). This file keeps only the type and page size so client
// components can import them without pulling in fs.

export interface Soknad {
  hvem: string;
  hva: string;
  dato: string;
  sokt: { label: string; url: string };
  resultat: { label: string; url: string; innvilget: boolean };
}

export const PAGE_SIZE = 8;
