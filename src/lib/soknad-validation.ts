export const MIN_SUM = 5000;
// Soft ceiling: amounts above this must be decided by generalforsamlingen,
// so the form warns but does not block.
export const MAX_SUM = 100000;
export const MIN_WORDS = 20;
export const MIN_WORDS_KONSEKVENSER = 5;

// Groups from tihlde.org/grupper and tihlde.org/interessegrupper (2026-07).
export const TIHLDE_GROUPS: Record<string, string[]> = {
  Hovedorgan: ["Hovedstyret", "Forvaltningsgruppen"],
  Undergrupper: [
    "Beta",
    "Index",
    "Kiosk og Kontor",
    "Næringsliv og Kurs",
    "Promo",
    "Sosialen",
  ],
  Komitéer: [
    "Drift",
    "FadderKom",
    "IdKom",
    "JenteKom",
    "JubKom",
    "Native",
    "Økom",
    "Redaksjonen",
    "Semikolon",
  ],
  Interessegrupper: [
    "Pythons Fotball Damer",
    "Pythons Fotball Herrer",
    "Pythons Håndball",
    "Pythons Volley",
    "TIHLDE Basket",
    "TIHLDE BH",
    "TIHLDE Biljard",
    "TIHLDE Dart",
    "TIHLDE Diskgolf",
    "TIHLDE Fotball og F1",
    "TIHLDE Golf",
    "TIHLDE Klask",
    "TIHLDE Klatring",
    "TIHLDE Plask",
    "TIHLDE Poker",
    "TIHLDE Rett&Vrang",
    "TIHLDE Ski",
    "TIHLDE Smash",
    "TIHLDE Spring",
    "TIHLDE Startup",
    "TIHLDE Tråkk",
    "TIHLDE Utveksling",
    "TIHLDEpodden",
    "Turtorial",
  ],
};

export const ALL_GROUPS = Object.values(TIHLDE_GROUPS).flat();

export interface BudsjettPost {
  utgift?: string;
  sum?: string | number;
}

export interface SoknadBody {
  sokerNavn?: string;
  kontaktperson?: string;
  telefon?: string;
  epost?: string;
  onsketSum?: string | number;
  hvaStotte?: string;
  begrunnelse?: string;
  konsekvenser?: string;
  budsjett?: BudsjettPost[];
}

export function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function validKontaktperson(s: string) {
  const words = s.trim().split(/\s+/).filter(Boolean);
  return (
    words.length >= 2 &&
    words.every((w) => /^[A-Za-zÆØÅæøåÀ-öø-ÿ'.-]{2,}$/.test(w))
  );
}

export function validTelefon(s: string) {
  return /^(\+47)?\d{8}$/.test(s.replace(/\s/g, ""));
}

export function validEpost(s: string) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(s.trim());
}

// A budget line needs a descriptive name (at least 3 letters) and a
// positive sum.
export function validBudsjettPost(post: BudsjettPost) {
  const letters = (post.utgift ?? "").replace(/[^A-Za-zÆØÅæøåÀ-ÿ]/g, "");
  const sum = Number(post.sum);
  return letters.length >= 3 && Number.isFinite(sum) && sum > 0;
}

// Returns an error message in Norwegian, or null when the body is valid.
export function validateSoknad(body: SoknadBody): string | null {
  const {
    sokerNavn,
    kontaktperson,
    telefon,
    epost,
    onsketSum,
    hvaStotte,
    begrunnelse,
    konsekvenser,
    budsjett,
  } = body;

  if (
    !sokerNavn ||
    !kontaktperson ||
    !telefon ||
    !epost ||
    !onsketSum ||
    !hvaStotte ||
    !begrunnelse ||
    !konsekvenser ||
    !Array.isArray(budsjett) ||
    budsjett.length === 0
  ) {
    return "Mangler påkrevde felt";
  }

  if (!ALL_GROUPS.includes(sokerNavn)) {
    return "Velg en gyldig gruppe fra listen";
  }

  if (!validKontaktperson(kontaktperson)) {
    return "Oppgi fullt navn på kontaktperson (fornavn og etternavn)";
  }

  if (!validTelefon(telefon)) {
    return "Ugyldig telefonnummer (8 siffer, eventuelt med +47)";
  }

  if (!validEpost(epost)) {
    return "Ugyldig e-postadresse";
  }

  const sum = Number(onsketSum);
  if (!Number.isFinite(sum) || sum < MIN_SUM) {
    return `Minimum søknadssum er ${MIN_SUM.toLocaleString("nb-NO")} kr`;
  }

  if (wordCount(hvaStotte) < MIN_WORDS || wordCount(begrunnelse) < MIN_WORDS) {
    return `Beskrivelsen og begrunnelsen må være på minst ${MIN_WORDS} ord hver`;
  }

  if (wordCount(konsekvenser) < MIN_WORDS_KONSEKVENSER) {
    return `Konsekvensene må beskrives med minst ${MIN_WORDS_KONSEKVENSER} ord`;
  }

  if (!budsjett.every(validBudsjettPost)) {
    return "Alle budsjettposter må ha et beskrivende navn og en sum større enn 0";
  }

  return null;
}
