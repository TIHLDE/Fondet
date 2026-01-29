import { NextResponse } from "next/server";

export const revalidate = 3600;

interface PortfolioEntry {
  date: string;
  fund: number;
  benchmark: number;
}

interface AllocationEntry {
  fund: string;
  allocation: number;
  category: string;
}

const FALLBACK_ALLOCATION: AllocationEntry[] = [
  { fund: "DNB Finans A", allocation: 4.7, category: "Bransjefond, Finans" },
  { fund: "Fondsfinans Utbytte B", allocation: 9.5, category: "Norge" },
  {
    fund: "KLP AksjeEuropa Indeks P",
    allocation: 15.6,
    category: "Europa, Store selskaper, Blanding",
  },
  {
    fund: "KLP AksjeGlobal Small Cap Indeks P",
    allocation: 13.4,
    category: "Globale, Små/mellomstore selskaper",
  },
  { fund: "Nordnet Danmark Indeks B", allocation: 15.0, category: "Danmark" },
  { fund: "Nordnet Sverige Index", allocation: 18.0, category: "Sverige" },
  {
    fund: "Nordnet USA Indeks",
    allocation: 18.9,
    category: "USA, Store selskaper, Blanding",
  },
  {
    fund: "Öhman Global Growth A",
    allocation: 5.0,
    category: "Bransjefond, Teknologi",
  },
];

// Placeholder data — replace with real data via Google Sheets.
// "fund" = TIHLDE-Fondet cumulative return %, "benchmark" = fictional placeholder (not real OSEBX).
const FALLBACK_PORTFOLIO: PortfolioEntry[] = [
  { date: "2021-02-01", fund: 0, benchmark: 0 },
  { date: "2021-04-01", fund: 3.2, benchmark: 2.8 },
  { date: "2021-06-01", fund: 5.1, benchmark: 5.0 },
  { date: "2021-08-01", fund: 7.4, benchmark: 6.3 },
  { date: "2021-10-01", fund: 9.0, benchmark: 8.1 },
  { date: "2021-12-01", fund: 11.2, benchmark: 10.5 },
  { date: "2022-02-01", fund: 9.8, benchmark: 8.2 },
  { date: "2022-04-01", fund: 7.5, benchmark: 5.1 },
  { date: "2022-06-01", fund: 5.0, benchmark: 2.3 },
  { date: "2022-08-01", fund: 6.8, benchmark: 3.9 },
  { date: "2022-10-01", fund: 4.2, benchmark: 1.5 },
  { date: "2022-12-01", fund: 6.0, benchmark: 3.0 },
  { date: "2023-02-01", fund: 8.5, benchmark: 5.2 },
  { date: "2023-04-01", fund: 6.9, benchmark: 2.8 },
  { date: "2023-06-01", fund: 11.3, benchmark: 7.1 },
  { date: "2023-08-01", fund: 14.0, benchmark: 9.5 },
  { date: "2023-10-01", fund: 15.8, benchmark: 10.8 },
  { date: "2023-12-01", fund: 18.2, benchmark: 12.4 },
  { date: "2024-02-01", fund: 21.5, benchmark: 14.9 },
  { date: "2024-04-01", fund: 26.0, benchmark: 16.2 },
  { date: "2024-06-01", fund: 29.5, benchmark: 16.8 },
  { date: "2024-08-01", fund: 31.2, benchmark: 18.0 },
  { date: "2024-10-01", fund: 33.8, benchmark: 19.5 },
  { date: "2024-12-01", fund: 36.1, benchmark: 21.3 },
  { date: "2025-02-01", fund: 38.0, benchmark: 22.8 },
  { date: "2025-04-01", fund: 35.5, benchmark: 20.1 },
  { date: "2025-06-01", fund: 39.2, benchmark: 23.5 },
  { date: "2025-08-01", fund: 42.1, benchmark: 25.0 },
  { date: "2025-10-01", fund: 44.8, benchmark: 26.7 },
  { date: "2025-12-01", fund: 47.3, benchmark: 28.4 },
  { date: "2026-01-01", fund: 48.5, benchmark: 29.1 },
];

function parseCSV(csv: string): string[][] {
  const lines = csv.trim().split("\n");
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

async function fetchSheetCSV(
  sheetId: string,
  tabName: string,
): Promise<string[][] | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const text = await res.text();
    return parseCSV(text);
  } catch {
    return null;
  }
}

export async function GET() {
  const sheetId = process.env.NEXT_PUBLIC_SHEET_ID;

  let portfolio: PortfolioEntry[] = FALLBACK_PORTFOLIO;
  let allocation: AllocationEntry[] = FALLBACK_ALLOCATION;

  if (sheetId && sheetId !== "YOUR_GOOGLE_SHEET_ID_HERE") {
    const [portfolioRows, allocationRows] = await Promise.all([
      fetchSheetCSV(sheetId, "Portfolio"),
      fetchSheetCSV(sheetId, "Allocation"),
    ]);

    if (portfolioRows && portfolioRows.length > 1) {
      portfolio = portfolioRows.slice(1).map((row) => ({
        date: row[0] || "",
        fund: parseFloat(row[1]) || 0,
        benchmark: parseFloat(row[2]) || 0,
      }));
    }

    if (allocationRows && allocationRows.length > 1) {
      allocation = allocationRows
        .slice(1)
        .map((row) => ({
          fund: row[0] || "",
          allocation: parseFloat(row[1]) || 0,
          category: row[2] || "",
        }))
        .filter((e) => e.fund && e.allocation > 0);
    }
  }

  return NextResponse.json({ portfolio, allocation });
}
