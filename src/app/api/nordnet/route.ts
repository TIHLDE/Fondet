import { NextResponse } from "next/server";
import { getProfile, getTrades, getHoldings } from "@/lib/nordnet";
import { getReportData, reportFundFor, namesMatch } from "@/lib/fordeling";
import { readJson } from "@/lib/data-store";

export const revalidate = 1800;

interface Content {
  soldOut?: string[];
}

export async function GET() {
  const [profile, trades, report] = await Promise.all([
    getProfile(),
    getTrades(),
    getReportData(),
  ]);
  // Funds the Forvaltningsgruppen has confirmed fully sold since the newest
  // report; the trade feed alone cannot tell a full exit from a partial sell.
  const soldOut = readJson<Content>("content").soldOut ?? [];
  const reportFundNames = report?.funds.map((f) => f.name) ?? [];
  const holdings = await getHoldings(trades, reportFundNames, soldOut);
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
    fordeling: (report?.funds ?? []).filter(
      (f) => !soldOut.some((s) => namesMatch(s, f.name)),
    ),
    weightAsOf: report?.period ?? null,
  });
}
