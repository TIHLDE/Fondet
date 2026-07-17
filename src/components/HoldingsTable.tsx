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

function Weight({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="inline-block rounded bg-cardBorder/50 px-2 py-0.5 text-xs font-medium text-foreground-secondary">
        Ny
      </span>
    );
  }
  return (
    <span className="text-foreground-primary">
      {value.toFixed(2).replace(".", ",")} %
    </span>
  );
}

function Fee({ value }: { value: number | null }) {
  if (value === null) return <span className="text-foreground-secondary">-</span>;
  return (
    <span className="text-foreground-primary">
      {value.toFixed(2).replace(".", ",")} %
    </span>
  );
}

// SFDR article: 8 promotes environmental/social traits, 9 targets sustainable
// investment. Article 6 (no ESG focus) gets no badge.
function Esg({ article }: { article: number | null }) {
  if (article !== 8 && article !== 9) return null;
  const label = article === 9 ? "Bærekraft" : "ESG";
  return (
    <span
      className="inline-block rounded bg-success/15 px-1.5 py-0.5 text-xs font-medium text-success"
      title={`SFDR artikkel ${article}`}
    >
      {label}
    </span>
  );
}

function Rating({ value }: { value: number | null }) {
  if (value === null) return null;
  return (
    <span
      className="text-foreground-secondary"
      aria-label={`Morningstar ${value} av 5`}
      title={`Morningstar ${value} av 5`}
    >
      {"★".repeat(value)}
      <span className="opacity-30">{"★".repeat(Math.max(0, 5 - value))}</span>
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
  const weightAsOf = data?.weightAsOf ?? null;
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
                Andel
              </th>
              <th className="text-right py-3 px-4 text-foreground-primary font-semibold">
                Honorar
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
                        className="w-6 h-6 rounded object-contain shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{h.name}</span>
                        <Rating value={h.rating} />
                        <Esg article={h.esgArticle} />
                      </div>
                      <p className="text-xs text-foreground-secondary">
                        {h.benchmark ?? h.category ?? ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Weight value={h.weight} />
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Fee value={h.feePercent} />
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {weightAsOf && (
        <p className="mt-4 text-sm text-foreground-secondary">
          Andel, honorar og referanseindeks er hentet fra rapporten for{" "}
          {weightAsOf}. Rating og ESG kommer fra Nordnet. Fond merket «Ny» er
          kjøpt etter rapporten og mangler publiserte tall ennå.
        </p>
      )}
    </div>
  );
}
