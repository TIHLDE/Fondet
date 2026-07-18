import { describe, it, expect } from "vitest";
import { memberFields, slugify } from "./helpers";

describe("slugify", () => {
  it("transliterates norwegian letters", () => {
    expect(slugify("Kaja Sætherhaug Dalåmo")).toBe("kaja-saetherhaug-dalamo");
    expect(slugify("Bjørn Ødegård")).toBe("bjorn-odegard");
  });

  it("strips other diacritics and symbols", () => {
    expect(slugify("Tri Tác Lê")).toBe("tri-tac-le");
    expect(slugify("  A.  B!  ")).toBe("a-b");
  });
});

describe("memberFields", () => {
  it("keeps only the editable fields", () => {
    const parsed = memberFields({
      name: " Kari ",
      role: "Leder",
      id: "hacked",
      image: "https://evil/x.jpg",
      startYear: 2025,
    });
    expect(parsed).toEqual({
      value: { name: "Kari", role: "Leder", startYear: 2025 },
    });
  });

  it("rejects wrong types and out of range years", () => {
    expect(memberFields({ name: 42 })).toHaveProperty("error");
    expect(memberFields({ startYear: 1999 })).toHaveProperty("error");
    expect(memberFields({ endYear: "ikke et tall" })).toHaveProperty("error");
  });

  it("ignores empty year strings", () => {
    expect(memberFields({ endYear: "" })).toEqual({ value: {} });
  });
});
