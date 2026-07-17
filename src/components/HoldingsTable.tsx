"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNordnet } from "./NordnetProfileCard";
import type { Holding } from "@/lib/nordnet-types";

type SortKey = "name" | "weight" | "fee" | "nav" | "year" | "three";
type SortDir = "asc" | "desc";

const NUM_ACCESSOR: Record<Exclude<SortKey, "name">, (h: Holding) => number | null> = {
  weight: (h) => h.weight,
  fee: (h) => h.feePercent,
  nav: (h) => h.nav,
  year: (h) => h.performanceThisYear,
  three: (h) => h.performanceThreeYears,
};

// Sort holdings by the chosen column. Missing numbers always sink to the
// bottom, whichever direction is active, so blanks never crowd the top.
function sortHoldings(rows: Holding[], key: SortKey, dir: SortDir): Holding[] {
  const out = [...rows];
  if (key === "name") {
    out.sort((a, b) => a.name.localeCompare(b.name, "nb"));
    if (dir === "desc") out.reverse();
    return out;
  }
  const get = NUM_ACCESSOR[key];
  out.sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    if (va === null && vb === null) return 0;
    if (va === null) return 1;
    if (vb === null) return -1;
    return dir === "asc" ? va - vb : vb - va;
  });
  return out;
}

// prospectusUrl comes from Nordnet's API, so guard the anchor against a
// javascript:/data: scheme before trusting it in href.
function safeHttpUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function Pct({ value }: { value: number | null }) {
  if (value === null) return <span>-</span>;
  const up = value >= 0;
  const color = up ? "text-success" : "text-red-600 dark:text-red-400";
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center justify-end gap-0.5 ${color}`}>
      <Arrow className="w-3.5 h-3.5" aria-hidden />
      {up ? "+" : ""}
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

const COLUMNS: { key: SortKey; label: string; defaultDir: SortDir }[] = [
  { key: "name", label: "Fond", defaultDir: "asc" },
  { key: "weight", label: "Andel", defaultDir: "desc" },
  { key: "fee", label: "Honorar", defaultDir: "asc" },
  { key: "nav", label: "Kurs (NAV)", defaultDir: "desc" },
  { key: "year", label: "I år", defaultDir: "desc" },
  { key: "three", label: "3 år", defaultDir: "desc" },
];

export default function HoldingsTable() {
  const { data, isLoading } = useNordnet();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  if (isLoading) {
    return (
      <div className="h-64 rounded-lg bg-cardBackground border border-cardBorder animate-pulse" />
    );
  }

  const raw = data?.holdings ?? [];
  const weightAsOf = data?.weightAsOf ?? null;
  const holdings = sortHoldings(raw, sortKey, sortDir);

  function toggleSort(col: (typeof COLUMNS)[number]) {
    if (sortKey === col.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir(col.defaultDir);
    }
  }

  if (raw.length === 0) {
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
              {COLUMNS.map((col) => {
                const activeSort = sortKey === col.key;
                const first = col.key === "name";
                const Chevron = sortDir === "asc" ? ChevronUp : ChevronDown;
                return (
                  <th
                    key={col.key}
                    aria-sort={
                      activeSort
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    className={`py-3 px-4 text-foreground-primary font-semibold ${
                      first ? "text-left" : "text-right"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className={`inline-flex items-center gap-1 rounded transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-primary ${
                        first ? "" : "flex-row-reverse"
                      } ${activeSort ? "text-accent" : ""}`}
                    >
                      {col.label}
                      <Chevron
                        className={`w-3.5 h-3.5 ${activeSort ? "opacity-100" : "opacity-30"}`}
                        aria-hidden
                      />
                    </button>
                  </th>
                );
              })}
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
                      {safeHttpUrl(h.prospectusUrl) && (
                        <a
                          href={safeHttpUrl(h.prospectusUrl)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-0.5 text-xs text-accent hover:underline"
                        >
                          Prospekt
                          <ExternalLink className="w-3 h-3" aria-hidden />
                        </a>
                      )}
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
