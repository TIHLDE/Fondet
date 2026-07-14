import { describe, it, expect } from "vitest";
import { equalWeightComposite } from "./series";
import type { Series } from "./nordnet-types";

function fund(label: string, points: [number, number][]): Series {
  return {
    label,
    kind: "fund",
    points: points.map(([time, value]) => ({ time, value })),
  };
}

describe("equalWeightComposite", () => {
  it("averages two funds with aligned timestamps", () => {
    const result = equalWeightComposite(
      [
        fund("a", [
          [1, 0],
          [2, 10],
        ]),
        fund("b", [
          [1, 0],
          [2, 20],
        ]),
      ],
      "Snitt",
    );
    expect(result).not.toBeNull();
    expect(result!.label).toBe("Snitt");
    expect(result!.points).toEqual([
      { time: 1, value: 0 },
      { time: 2, value: 15 },
    ]);
  });

  it("forward-fills when one fund misses a day", () => {
    const result = equalWeightComposite(
      [
        fund("a", [
          [1, 0],
          [2, 10],
          [3, 30],
        ]),
        fund("b", [
          [1, 0],
          [3, 20],
        ]),
      ],
      "Snitt",
    );
    // day 2: a=10, b forward-filled to 0 -> 5
    expect(result!.points[1]).toEqual({ time: 2, value: 5 });
    expect(result!.points[2]).toEqual({ time: 3, value: 25 });
  });

  it("skips leading times before every fund has data", () => {
    const result = equalWeightComposite(
      [
        fund("a", [
          [1, 5],
          [2, 10],
          [3, 15],
        ]),
        fund("b", [
          [2, 0],
          [3, 20],
        ]),
      ],
      "Snitt",
    );
    expect(result!.points[0].time).toBe(2);
  });

  it("returns null for fewer than two funds", () => {
    expect(equalWeightComposite([], "Snitt")).toBeNull();
    expect(
      equalWeightComposite(
        [
          fund("a", [
            [1, 0],
            [2, 1],
          ]),
        ],
        "Snitt",
      ),
    ).toBeNull();
  });

  it("returns null when overlap is too short", () => {
    const result = equalWeightComposite(
      [fund("a", [[1, 0]]), fund("b", [[1, 0]])],
      "Snitt",
    );
    expect(result).toBeNull();
  });
});
