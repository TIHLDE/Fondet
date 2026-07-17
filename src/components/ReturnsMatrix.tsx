"use client";

import { useNordnet } from "./NordnetProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Holding } from "@/lib/nordnet-types";

const PERIODS: { key: keyof Holding; label: string }[] = [
  { key: "performanceOneMonth", label: "1 md" },
  { key: "performanceThisYear", label: "I år" },
  { key: "performanceThreeYears", label: "3 år" },
  { key: "performanceFiveYears", label: "5 år" },
];

function fmt(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1).replace(".", ",")} %`;
}

export default function ReturnsMatrix() {
  const { data, isLoading } = useNordnet();

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-8 w-72 max-w-full mb-2" />
        <Skeleton className="h-4 w-52 max-w-full mb-6" />
        <Skeleton className="h-2 w-full rounded-full mb-6" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-3 border-b border-cardBorder/50"
          >
            <Skeleton className="h-4 w-48 max-w-full" />
            <div className="flex gap-6 shrink-0">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="hidden sm:block h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const holdings = data?.holdings ?? [];
  if (holdings.length === 0) return null;

  const ytd = holdings.filter((h) => h.performanceThisYear !== null);
  const up = ytd.filter((h) => h.performanceThisYear! >= 0).length;
  const upPct = ytd.length ? (100 * up) / ytd.length : 0;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-1">
        Avkastning per periode
      </h2>
      <p className="text-sm text-foreground-secondary mb-5">
        Fondenes egne tall fra Nordnet.
      </p>

      {ytd.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-foreground-primary">
              {up} av {ytd.length} fond i pluss hittil i år
            </span>
            <span className="text-foreground-secondary tabular-nums">
              {Math.round(upPct)} %
            </span>
          </div>
          <div
            className="flex h-2 overflow-hidden rounded-full bg-cardBorder"
            role="img"
            aria-label={`${up} av ${ytd.length} fond er i pluss hittil i år`}
          >
            <div
              className="h-full bg-success"
              style={{ width: `${upPct}%` }}
            />
            <div
              className="h-full bg-red-500 dark:bg-red-400"
              style={{ width: `${100 - upPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Avkastning per fond over 1 måned, i år, 3 år og 5 år
          </caption>
          <thead>
            <tr className="border-b border-cardBorder">
              <th
                scope="col"
                className="py-2 pr-4 text-left font-medium text-foreground-secondary"
              >
                Fond
              </th>
              {PERIODS.map((p) => (
                <th
                  key={p.label}
                  scope="col"
                  className="py-2 px-3 text-right font-medium text-foreground-secondary tabular-nums"
                >
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.legacyInstrumentId} className="border-b border-cardBorder/50">
                <th
                  scope="row"
                  className="py-2 pr-4 text-left font-normal text-foreground-primary max-w-[16rem] truncate"
                >
                  {h.name}
                </th>
                {PERIODS.map((p) => {
                  const v = h[p.key] as number | null;
                  return (
                    <td
                      key={p.label}
                      className={`py-2 px-3 text-right tabular-nums ${
                        v === null
                          ? "text-foreground-secondary"
                          : v >= 0
                            ? "text-success"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {v !== null ? fmt(v) : "–"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
