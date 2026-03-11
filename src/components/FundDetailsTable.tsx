"use client";

import { useEffect, useState } from "react";

interface Fund {
  name: string;
  allocation: string;
  category: string;
  fundId: string;
}

interface NavData {
  name: string;
  nav: number | null;
  change: number | null;
  changePercent: number | null;
}

const FUNDS: Fund[] = [
  {
    name: "DNB Finans A",
    allocation: "4.7%",
    category: "Bransjefond, Finans",
    fundId: "dnb-finans-a-nok-1981c92a",
  },
  {
    name: "Fondsfinans Utbytte B",
    allocation: "9.5%",
    category: "Norge",
    fundId: "fondsfinans-norden-utbytte-b-nok-49bbc100",
  },
  {
    name: "KLP AksjeEuropa Indeks P",
    allocation: "15.6%",
    category: "Europa, Store selskaper, Blanding",
    fundId: "klp-aksje-europa-indeks-n-nok-a7c7595a",
  },
  {
    name: "KLP AksjeGlobal Small Cap Indeks P",
    allocation: "13.4%",
    category: "Globale, Små/mellomstore selskaper",
    fundId: "klp-aksje-global-small-cap-nok-8ad61e91",
  },
  {
    name: "Nordnet Danmark Indeks B",
    allocation: "15.0%",
    category: "Danmark",
    fundId: "nordnet-danmark-indeks-b-dkk-580fe6e9",
  },
  {
    name: "Nordnet Sverige Index",
    allocation: "18.0%",
    category: "Sverige",
    fundId: "nordnet-sverige-index-sek-aa7a9014",
  },
  {
    name: "Nordnet USA Indeks",
    allocation: "18.9%",
    category: "USA, Store selskaper, Blanding",
    fundId: "nordnet-usa-indeks-nok-nok-c2287ca3",
  },
  {
    name: "Öhman Global Growth A",
    allocation: "5.0%",
    category: "Bransjefond, Teknologi",
    fundId: "ohman-global-growth-a-sek-afad56f8",
  },
];

export default function FundDetailsTable() {
  const [navData, setNavData] = useState<Record<string, NavData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundData = async () => {
      const headers = {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
        "x-locale": "nb-NO",
        accept: "application/json",
      };

      const results = await Promise.all(
        FUNDS.map(async (fund) => {
          try {
            const url = `https://api.prod.nntech.io/instrument-screening/v1/mutual-funds/web/${fund.fundId}`;
            const response = await fetch(url, { headers });

            if (!response.ok) {
              console.error(`Failed to fetch ${fund.name}: ${response.status}`);
              return {
                name: fund.name,
                nav: null,
                change: null,
                changePercent: null,
              };
            }

            const data = await response.json();

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

      const navMap: Record<string, NavData> = {};
      results.forEach((fund) => {
        navMap[fund.name] = fund;
      });
      setNavData(navMap);
      setLoading(false);
    };

    fetchFundData();
  }, []);

  const formatChange = (changePercent: number | null) => {
    if (changePercent === null) return "-";
    const sign = changePercent >= 0 ? "+" : "";
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const getChangeColor = (changePercent: number | null) => {
    if (changePercent === null) return "text-foreground-secondary";
    return changePercent >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Fondets sammensetning (detaljer)
      </h2>

      <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-md">
        <div className="flex items-start space-x-3">
          <div className="shrink-0">
            <svg
              className="w-5 h-5 text-warning mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-warning font-semibold text-sm mb-1">
              Viktig merknad
            </h3>
            <p className="text-foreground-secondary text-sm leading-relaxed">
              Dette er bare veiledende tall da vi har mistet tilgang til Nordnet
              API og kan derfor ikke gi dere nøyaktige tall på dette tidspunktet.
              Index og Forvaltningsgruppen jobber på saken.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cardBorder">
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                Fond
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                Andel
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                Utvikling
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                Kategori
              </th>
            </tr>
          </thead>
          <tbody>
            {FUNDS.map((fund, index) => {
              const nav = navData[fund.name];
              const isLast = index === FUNDS.length - 1;
              
              return (
                <tr
                  key={fund.name}
                  className={isLast ? "" : "border-b border-cardBorder"}
                >
                  <td className="py-3 px-4 text-foreground-secondary">
                    {fund.name}
                  </td>
                  <td className="py-3 px-4 text-foreground-secondary">
                    {fund.allocation}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      loading
                        ? "text-foreground-secondary"
                        : getChangeColor(nav?.changePercent ?? null)
                    }`}
                  >
                    {loading ? "..." : formatChange(nav?.changePercent ?? null)}
                  </td>
                  <td className="py-3 px-4 text-foreground-secondary">
                    {fund.category}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
