import { describe, it, expect } from "vitest";
import {
  validateSoknad,
  wordCount,
  validTelefon,
  validEpost,
  validKontaktperson,
  validBudsjettPost,
  ALL_GROUPS,
  MIN_WORDS,
  MIN_SUM,
} from "./soknad-validation";

const longText = Array.from({ length: MIN_WORDS }, (_, i) => `ord${i}`).join(
  " ",
);

const valid = {
  sokerNavn: "Promo",
  kontaktperson: "Kari Nordmann",
  telefon: "12345678",
  epost: "kari@tihlde.org",
  onsketSum: "6000",
  hvaStotte: longText,
  begrunnelse: longText,
  konsekvenser: "Da må arrangementet avlyses i sin helhet",
  budsjett: [{ utgift: "Leie av lokale", sum: "6000" }],
};

describe("wordCount", () => {
  it("counts words separated by any whitespace", () => {
    expect(wordCount("en  to\ntre")).toBe(3);
    expect(wordCount("   ")).toBe(0);
    expect(wordCount("")).toBe(0);
  });
});

describe("field validators", () => {
  it("accepts Norwegian phone numbers with and without +47", () => {
    expect(validTelefon("12345678")).toBe(true);
    expect(validTelefon("+47 123 45 678")).toBe(true);
    expect(validTelefon("1234567")).toBe(false);
    expect(validTelefon("123456789")).toBe(false);
    expect(validTelefon("abcdefgh")).toBe(false);
  });

  it("rejects malformed email addresses", () => {
    expect(validEpost("kari@tihlde.org")).toBe(true);
    expect(validEpost("kari@tihlde")).toBe(false);
    expect(validEpost("kari.tihlde.org")).toBe(false);
    expect(validEpost("k @tihlde.org")).toBe(false);
  });

  it("requires full name for kontaktperson", () => {
    expect(validKontaktperson("Kari Nordmann")).toBe(true);
    expect(validKontaktperson("Kari")).toBe(false);
    expect(validKontaktperson("1")).toBe(false);
    expect(validKontaktperson("Kari 123")).toBe(false);
  });

  it("rejects nonsense budget lines", () => {
    expect(validBudsjettPost({ utgift: "Leie av lokale", sum: "500" })).toBe(
      true,
    );
    expect(validBudsjettPost({ utgift: "aa", sum: "500" })).toBe(false);
    expect(validBudsjettPost({ utgift: "123", sum: "500" })).toBe(false);
    expect(validBudsjettPost({ utgift: "Leie", sum: "0" })).toBe(false);
    expect(validBudsjettPost({ utgift: "Leie", sum: "" })).toBe(false);
  });
});

describe("validateSoknad", () => {
  it("accepts a complete application", () => {
    expect(validateSoknad(valid)).toBeNull();
  });

  it("rejects missing required fields", () => {
    expect(validateSoknad({ ...valid, epost: "" })).toMatch(/påkrevde/);
    expect(validateSoknad({ ...valid, konsekvenser: "" })).toMatch(/påkrevde/);
    expect(validateSoknad({ ...valid, budsjett: [] })).toMatch(/påkrevde/);
    expect(validateSoknad({})).toMatch(/påkrevde/);
  });

  it("rejects groups that do not exist in TIHLDE", () => {
    expect(validateSoknad({ ...valid, sokerNavn: "Tullegruppa" })).toMatch(
      /gyldig gruppe/,
    );
    expect(ALL_GROUPS).toContain("Hovedstyret");
  });

  it("rejects invalid kontaktperson, telefon and epost", () => {
    expect(validateSoknad({ ...valid, kontaktperson: "1" })).toMatch(
      /fullt navn/,
    );
    expect(validateSoknad({ ...valid, telefon: "1" })).toMatch(/telefon/i);
    expect(validateSoknad({ ...valid, epost: "ugyldig" })).toMatch(/e-post/i);
  });

  it("rejects sums below the minimum", () => {
    expect(validateSoknad({ ...valid, onsketSum: String(MIN_SUM - 1) })).toMatch(
      /Minimum/,
    );
    expect(validateSoknad({ ...valid, onsketSum: "ikke et tall" })).toMatch(
      /Minimum/,
    );
  });

  it("accepts the exact minimum sum", () => {
    expect(validateSoknad({ ...valid, onsketSum: String(MIN_SUM) })).toBeNull();
  });

  it("rejects descriptions under the word minimum", () => {
    expect(validateSoknad({ ...valid, hvaStotte: "for kort" })).toMatch(/ord/);
    expect(validateSoknad({ ...valid, begrunnelse: "for kort" })).toMatch(
      /ord/,
    );
  });

  it("rejects too short konsekvenser", () => {
    expect(validateSoknad({ ...valid, konsekvenser: "blir kjipt" })).toMatch(
      /Konsekvensene/,
    );
  });

  it("rejects nonsense budget entries", () => {
    expect(
      validateSoknad({ ...valid, budsjett: [{ utgift: "x", sum: "6000" }] }),
    ).toMatch(/budsjettpost/);
  });

  it("word padding with spaces does not count", () => {
    const padded = "ord ".repeat(MIN_WORDS - 1) + "   ";
    expect(validateSoknad({ ...valid, begrunnelse: padded })).toMatch(/ord/);
  });
});
