import { NextResponse } from "next/server";
import { getProfile, getTrades, getHoldings } from "@/lib/nordnet";
import { getReportData, reportFundFor } from "@/lib/fordeling";

export const revalidate = 1800;

export async function GET() {
  const [profile, trades, report] = await Promise.all([
    getProfile(),
    getTrades(),
    getReportData(),
  ]);
  const holdings = await getHoldings(trades);
  const withReport = holdings.map((h) => {
    const fund = reportFundFor(h.name, report);
    return {
      ...h,
      weight: fund?.weight ?? null,
      feePercent: fund?.feePercent ?? null,
      benchmark: fund?.benchmark ?? null,
    };
  });

  return NextResponse.json({
    profile,
    holdings: withReport,
    trades: trades.slice(0, 100),
    fordeling: report?.funds ?? [],
    weightAsOf: report?.period ?? null,
  });
}
