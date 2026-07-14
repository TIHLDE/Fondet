import { NextRequest, NextResponse } from "next/server";
import {
  getSeries,
  resolveIndexIdentifier,
  SERIES_PERIODS,
  type SeriesPeriod,
} from "@/lib/nordnet";

export const revalidate = 1800;

// GET /api/nordnet/series?period=YEAR_1&funds=uuid:Label,...&indexes=OSEBX,...
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const periodParam = params.get("period") ?? "YEAR_1";
  const period: SeriesPeriod = SERIES_PERIODS.includes(
    periodParam as SeriesPeriod,
  )
    ? (periodParam as SeriesPeriod)
    : "YEAR_1";

  const funds = (params.get("funds") ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 12)
    .map((pair) => {
      const [identifier, ...label] = pair.split(":");
      return { identifier, label: label.join(":") || identifier };
    });

  const indexes = (params.get("indexes") ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 4);

  const fundSeries = await Promise.all(
    funds.map(async (f) => ({
      label: f.label,
      kind: "fund" as const,
      points: await getSeries(f.identifier, period, true),
    })),
  );

  const indexSeries = await Promise.all(
    indexes.map(async (name) => {
      const identifier = await resolveIndexIdentifier(name);
      return {
        label: name,
        kind: "index" as const,
        points: identifier ? await getSeries(identifier, period, false) : [],
      };
    }),
  );

  return NextResponse.json({
    period,
    series: [...fundSeries, ...indexSeries].filter((s) => s.points.length > 0),
  });
}
