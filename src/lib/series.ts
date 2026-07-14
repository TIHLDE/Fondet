import type { Series, SeriesPoint } from "./nordnet-types";

// Equal-weighted average of the holding series. Real weights are not
// public, so this is the closest honest approximation of the portfolio.
export function equalWeightComposite(
  funds: Series[],
  label: string,
): Series | null {
  if (funds.length < 2) return null;

  const times = Array.from(
    new Set(funds.flatMap((f) => f.points.map((p) => p.time))),
  ).sort((a, b) => a - b);

  const idx = funds.map(() => 0);
  const last = funds.map<number | null>(() => null);
  const points: SeriesPoint[] = [];

  for (const t of times) {
    funds.forEach((f, i) => {
      while (idx[i] < f.points.length && f.points[idx[i]].time <= t) {
        last[i] = f.points[idx[i]].value;
        idx[i]++;
      }
    });
    if (last.every((v) => v !== null)) {
      const sum = last.reduce<number>((a, v) => a + (v as number), 0);
      points.push({ time: t, value: sum / funds.length });
    }
  }

  return points.length >= 2 ? { label, kind: "fund", points } : null;
}
