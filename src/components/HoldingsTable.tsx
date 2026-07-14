"use client";

import Image from "next/image";
import { useNordnet } from "./NordnetProfileCard";

function Pct({ value }: { value: number | null }) {
  if (value === null) return <span>-</span>;
  const color = value >= 0 ? "text-success" : "text-red-600 dark:text-red-400";
  return (
    <span className={color}>
      {value >= 0 ? "+" : ""}
      {value.toFixed(2).replace(".", ",")} %
    </span>
  );
}

export default function HoldingsTable() {
  const { data, isLoading } = useNordnet();

  if (isLoading) {
    return (
      <div className="h-64 rounded-lg bg-cardBackground border border-cardBorder animate-pulse" />
    );
  }

  const holdings = data?.holdings ?? [];
  if (holdings.length === 0) {
    return (
      <p className="text-foreground-secondary">
        Fikk ikke hentet porteføljen fra Nordnet akkurat nå. Prøv igjen senere.
      </p>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-6">
        Fondets sammensetning
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cardBorder">
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                Fond
              </th>
              <th className="text-right py-3 px-4 text-foreground-primary font-semibold">
                Kurs (NAV)
              </th>
              <th className="text-right py-3 px-4 text-foreground-primary font-semibold">
                I år
              </th>
              <th className="text-right py-3 px-4 text-foreground-primary font-semibold">
                3 år
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                Kategori
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr
                key={h.legacyInstrumentId}
                className="border-b border-cardBorder last:border-b-0"
              >
                <td className="py-3 px-4 text-foreground-primary">
                  <div className="flex items-center gap-3">
                    {h.logoUrl && (
                      <Image
                        src={h.logoUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded object-contain"
                      />
                    )}
                    <span>{h.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-foreground-secondary whitespace-nowrap">
                  {h.nav !== null
                    ? h.nav.toLocaleString("nb-NO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Pct value={h.performanceThisYear} />
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Pct value={h.performanceThreeYears} />
                </td>
                <td className="py-3 px-4 text-foreground-secondary">
                  {h.category ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
