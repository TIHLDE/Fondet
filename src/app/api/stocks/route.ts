import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

interface PortfolioEntry {
  date: string;
  value: number;
}

interface AllocationEntry {
  fund: string;
  allocation: number;
  category: string;
}

const FALLBACK_ALLOCATION: AllocationEntry[] = [
  { fund: "DNB Finans A", allocation: 4.7, category: "Bransjefond, Finans" },
  { fund: "Fondsfinans Utbytte B", allocation: 9.5, category: "Norge" },
  { fund: "KLP AksjeEuropa Indeks P", allocation: 15.6, category: "Europa, Store selskaper, Blanding" },
  { fund: "KLP AksjeGlobal Small Cap Indeks P", allocation: 13.4, category: "Globale, Små/mellomstore selskaper" },
  { fund: "Nordnet Danmark Indeks B", allocation: 15.0, category: "Danmark" },
  { fund: "Nordnet Sverige Index", allocation: 18.0, category: "Sverige" },
  { fund: "Nordnet USA Indeks", allocation: 18.9, category: "USA, Store selskaper, Blanding" },
  { fund: "Öhman Global Growth A", allocation: 5.0, category: "Bransjefond, Teknologi" },
];

const FALLBACK_PORTFOLIO: PortfolioEntry[] = [
  { date: "2024-01-01", value: 100000 },
  { date: "2024-02-01", value: 102500 },
  { date: "2024-03-01", value: 105000 },
  { date: "2024-04-01", value: 103000 },
  { date: "2024-05-01", value: 107000 },
  { date: "2024-06-01", value: 110000 },
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

async function fetchSheetCSV(sheetId: string, tabName: string): Promise<string[][] | null> {
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
        value: parseFloat(row[1]) || 0,
      })).filter((e) => e.date && e.value > 0);
    }

    if (allocationRows && allocationRows.length > 1) {
      allocation = allocationRows.slice(1).map((row) => ({
        fund: row[0] || "",
        allocation: parseFloat(row[1]) || 0,
        category: row[2] || "",
      })).filter((e) => e.fund && e.allocation > 0);
    }
  }

  return NextResponse.json({ portfolio, allocation });
}
