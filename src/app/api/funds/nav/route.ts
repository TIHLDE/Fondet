import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

interface FundMapping {
  name: string;
  fundUrl: string;
}

const FUND_MAPPINGS: FundMapping[] = [
  {
    name: "DNB Finans A",
    fundUrl: "https://www.nordnet.no/fond/liste/dnb-finans-a-nok-1981c92a",
  },
  {
    name: "Fondsfinans Utbytte B",
    fundUrl:
      "https://www.nordnet.no/fond/liste/fondsfinans-norden-utbytte-b-nok-49bbc100",
  },
  {
    name: "KLP AksjeEuropa Indeks P",
    fundUrl:
      "https://www.nordnet.no/fond/liste/klp-aksje-europa-indeks-n-nok-a7c7595a",
  },
  {
    name: "KLP AksjeGlobal Small Cap Indeks P",
    fundUrl:
      "https://www.nordnet.no/fond/liste/klp-aksje-global-small-cap-nok-8ad61e91",
  },
  {
    name: "Nordnet Danmark Indeks B",
    fundUrl:
      "https://www.nordnet.no/fond/liste/nordnet-danmark-indeks-b-dkk-580fe6e9",
  },
  {
    name: "Nordnet Sverige Index",
    fundUrl:
      "https://www.nordnet.no/fond/liste/nordnet-sverige-index-sek-aa7a9014",
  },
  {
    name: "Nordnet USA Indeks",
    fundUrl:
      "https://www.nordnet.no/fond/liste/nordnet-usa-indeks-nok-nok-c2287ca3",
  },
  {
    name: "Öhman Global Growth A",
    fundUrl:
      "https://www.nordnet.no/fond/liste/ohman-global-growth-a-sek-afad56f8",
  },
];

interface NavData {
  name: string;
  nav: number | null;
  change: number | null;
  changePercent: number | null;
}

export async function GET() {
  // Note: The Nordnet API is currently returning 404 errors for these endpoints
  // This might be due to:
  // 1. API endpoints being deprecated or moved
  // 2. Fund IDs being outdated
  // 3. Server-side requests being blocked by Nordnet
  //
  // For now, returning mock data. Need to investigate alternative data sources:
  // - Nordnet's GraphQL API
  // - Scraping the public fund pages
  // - Using a different data provider

  const mockData: NavData[] = [
    { name: "DNB Finans A", nav: 147.23, change: 1.45, changePercent: 0.99 },
    {
      name: "Fondsfinans Utbytte B",
      nav: 235.67,
      change: -0.89,
      changePercent: -0.38,
    },
    {
      name: "KLP AksjeEuropa Indeks P",
      nav: 189.45,
      change: 2.34,
      changePercent: 1.25,
    },
    {
      name: "KLP AksjeGlobal Small Cap Indeks P",
      nav: 156.78,
      change: -1.23,
      changePercent: -0.78,
    },
    {
      name: "Nordnet Danmark Indeks B",
      nav: 198.34,
      change: 0.56,
      changePercent: 0.28,
    },
    {
      name: "Nordnet Sverige Index",
      nav: 212.56,
      change: 1.78,
      changePercent: 0.84,
    },
    {
      name: "Nordnet USA Indeks",
      nav: 267.89,
      change: 3.45,
      changePercent: 1.30,
    },
    {
      name: "Öhman Global Growth A",
      nav: 178.23,
      change: -0.45,
      changePercent: -0.25,
    },
  ];

  return NextResponse.json({ funds: mockData });

  /* Original implementation - keeping for reference
  try {
    const headers = {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      "x-locale": "nb-NO",
      "accept": "application/json",
    };

    const results: NavData[] = await Promise.all(
      FUND_MAPPINGS.map(async (fund) => {
        try {
          const fundId = fund.fundUrl.split("/").pop() || "";
          const url = `https://api.prod.nntech.io/instrument-screening/v1/mutual-funds/web/${fundId}`;
          console.log(`Fetching ${fund.name} from ${url}`);
          
          const response = await fetch(url, { 
            headers, 
            cache: 'no-store',
          });

          console.log(`${fund.name} response status: ${response.status}`);

          if (!response.ok) {
            const text = await response.text();
            console.error(`Failed to fetch ${fund.name}: ${response.status}`, text.substring(0, 200));
            return {
              name: fund.name,
              nav: null,
              change: null,
              changePercent: null,
            };
          }

          const data = await response.json();
          console.log(`${fund.name} data:`, JSON.stringify(data).substring(0, 200));
          
          return {
            name: fund.name,
            nav: data.nav?.value ?? null,
            change: data.performance?.oneDay?.change ?? null,
            changePercent: data.performance?.oneDay?.changePercent ?? null,
          };
        } catch (error) {
          console.error(`Error fetching ${fund.name}:`, error);
          return {
            name: fund.name,
            nav: null,
            change: null,
            changePercent: null,
          };
        }
      })
    );

    return NextResponse.json({ funds: results });
  } catch (error) {
    console.error("Error in NAV API:", error);
    return NextResponse.json(
      { error: "Failed to fetch fund data" },
      { status: 500 }
    );
  }
  */
}
