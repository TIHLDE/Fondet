import { describe, it, expect } from "vitest";
import { deriveHeldTrades } from "./nordnet";
import { namesMatch } from "./fordeling";
import type { Trade } from "./nordnet";

let nextId = 1;
function trade(name: string, tradeType: "BUY" | "SELL", date: string): Trade {
  return {
    date,
    tradeType,
    name,
    price: 100,
    currency: "NOK",
    logoUrl: null,
    legacyInstrumentId: nextId++,
    orderBookId: String(nextId),
  };
}

describe("namesMatch", () => {
  it("matches identical names", () => {
    expect(namesMatch("DNB Finans A", "DNB Finans A")).toBe(true);
  });

  it("ignores a differing share class letter", () => {
    expect(
      namesMatch(
        "KLP AksjeGlobal Small Cap Indeks P",
        "KLP AksjeGlobal Small Cap Indeks N",
      ),
    ).toBe(true);
  });

  it("ignores a NOK suffix", () => {
    expect(namesMatch("Nordnet Global Indeks NOK", "Nordnet Global Indeks")).toBe(
      true,
    );
  });

  it("rejects different funds", () => {
    expect(namesMatch("Nordnet USA Indeks", "Nordnet Sverige Index")).toBe(false);
    expect(namesMatch("Öhman Global Growth A", "Lannebo Global Growth A")).toBe(
      false,
    );
  });
});

describe("deriveHeldTrades", () => {
  const report = ["KLP AksjeGlobal Small Cap Indeks P", "Fondsfinans Utbytte B"];

  it("keeps funds whose latest trade is a buy", () => {
    const held = deriveHeldTrades(
      [trade("Nordnet USA Indeks", "BUY", "2026-03-06")],
      [],
      [],
    );
    expect(held.map((t) => t.name)).toEqual(["Nordnet USA Indeks"]);
  });

  it("keeps a report fund after a partial sell", () => {
    const held = deriveHeldTrades(
      [trade("KLP AksjeGlobal Small Cap Indeks N", "SELL", "2026-02-27")],
      report,
      [],
    );
    expect(held.map((t) => t.name)).toEqual([
      "KLP AksjeGlobal Small Cap Indeks N",
    ]);
  });

  it("drops a sold fund that is not in the report", () => {
    const held = deriveHeldTrades(
      [trade("Lannebo Global Growth A", "SELL", "2026-02-18")],
      report,
      [],
    );
    expect(held).toEqual([]);
  });

  it("drops a report fund listed as sold out", () => {
    const held = deriveHeldTrades(
      [trade("Fondsfinans Utbytte B", "SELL", "2026-02-27")],
      report,
      ["Fondsfinans Utbytte B"],
    );
    expect(held).toEqual([]);
  });

  it("uses only the latest trade per instrument", () => {
    const buy = trade("Nordnet Danmark Indeks B", "BUY", "2026-03-06");
    const sell = { ...buy, tradeType: "SELL" as const, date: "2026-01-10" };
    // newest first, same instrument: the buy wins
    const held = deriveHeldTrades([buy, sell], [], []);
    expect(held.map((t) => t.tradeType)).toEqual(["BUY"]);
  });
});
