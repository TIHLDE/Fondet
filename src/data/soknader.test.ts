import { describe, it, expect } from "vitest";
import { PAGE_SIZE, type Soknad } from "./soknader";
import { readJson } from "@/lib/data-store";

const SOKNADER = readJson<Soknad[]>("soknader");

function toDate(dato: string): number {
  const [d, m, y] = dato.split(".").map(Number);
  return new Date(y, m - 1, d).getTime();
}

describe("SOKNADER data", () => {
  it("has entries and more than one page", () => {
    expect(SOKNADER.length).toBeGreaterThan(PAGE_SIZE);
  });

  it("every row is complete", () => {
    for (const s of SOKNADER) {
      expect(s.hvem).toBeTruthy();
      expect(s.hva).toBeTruthy();
      expect(s.dato).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
      expect(s.sokt.label).toBeTruthy();
      expect(s.sokt.url).toMatch(/^https:\/\/drive\.google\.com\//);
      expect(s.resultat.label).toBeTruthy();
      expect(s.resultat.url).toMatch(/^https:\/\/drive\.google\.com\//);
    }
  });

  it("is sorted newest first", () => {
    for (let i = 1; i < SOKNADER.length; i++) {
      expect(toDate(SOKNADER[i - 1].dato)).toBeGreaterThanOrEqual(
        toDate(SOKNADER[i].dato),
      );
    }
  });

  it("rejected rows are labeled Avslått", () => {
    for (const s of SOKNADER) {
      if (!s.resultat.innvilget) {
        expect(s.resultat.label).toBe("Avslått");
      }
    }
  });
});
