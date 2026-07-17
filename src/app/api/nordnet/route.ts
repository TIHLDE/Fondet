import { NextResponse } from "next/server";
import { getProfile, getTrades, getHoldings } from "@/lib/nordnet";
import { getReportWeights, weightFor } from "@/lib/fordeling";

export const revalidate = 1800;

export async function GET() {
  const [profile, trades, report] = await Promise.all([
    getProfile(),
    getTrades(),
    getReportWeights(),
  ]);
  const holdings = await getHoldings(trades);
  const withWeights = holdings.map((h) => ({
    ...h,
    weight: weightFor(h.name, report),
  }));

  return NextResponse.json({
    profile,
    holdings: withWeights,
    trades: trades.slice(0, 100),
    weightAsOf: report?.period ?? null,
  });
}
