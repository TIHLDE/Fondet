import { NextResponse } from "next/server";
import { getProfile, getTrades, getHoldings } from "@/lib/nordnet";

export const revalidate = 1800;

export async function GET() {
  const [profile, trades] = await Promise.all([getProfile(), getTrades()]);
  const holdings = await getHoldings(trades);

  return NextResponse.json({
    profile,
    holdings,
    trades: trades.slice(0, 100),
  });
}
