"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNordnet } from "./NordnetProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
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

function pct(v: number | null): string {
  if (v === null) return "-";
  return `${v >= 0 ? "+" : ""}${v.toFixed(2).replace(".", ",")} %`;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-foreground-secondary">{label}</dt>
      <dd className="text-sm text-foreground-primary">{value}</dd>
    </div>
  );
}

export default function HoldingsTable() {
  const { data, isLoading, isFetching, refetch } = useNordnet();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggleRow(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-8 w-64 max-w-full mb-6" />
        <div className="border-b border-cardBorder pb-3 mb-1 flex justify-between gap-4">
          <Skeleton className="h-4 w-24" />
          <div className="hidden sm:flex gap-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-4 border-b border-cardBorder/50"
          >
            <Skeleton className="w-6 h-6 rounded shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-56 max-w-full" />
              <Skeleton className="h-3 w-36 max-w-full" />
            </div>
            <div className="hidden sm:flex gap-8">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
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
      <div className="text-foreground-secondary">
        <p>Fikk ikke hentet porteføljen fra Nordnet akkurat nå.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-3 inline-flex items-center rounded-md border border-cardBorder bg-cardBackground px-4 h-11 text-sm text-foreground-primary transition-colors hover:bg-cardBorder/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-primary disabled:opacity-60"
        >
          {isFetching ? "Prøver igjen..." : "Prøv igjen"}
        </button>
      </div>
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
            {holdings.map((h) => {
              const isOpen = expanded.has(h.legacyInstrumentId);
              return (
              <Fragment key={h.legacyInstrumentId}>
              <tr className="border-b border-cardBorder last:border-b-0">
                <td className="py-3 px-4 text-foreground-primary">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRow(h.legacyInstrumentId)}
                      aria-expanded={isOpen}
                      aria-controls={`detail-${h.legacyInstrumentId}`}
                      aria-label={
                        isOpen ? `Skjul detaljer for ${h.name}` : `Vis detaljer for ${h.name}`
                      }
                      className="shrink-0 rounded p-0.5 text-foreground-secondary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-primary"
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                        aria-hidden
                      />
                    </button>
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
              {isOpen && (
                <tr id={`detail-${h.legacyInstrumentId}`} className="border-b border-cardBorder last:border-b-0">
                  <td colSpan={COLUMNS.length} className="px-4 pb-4 pt-0">
                    {/* w-0 + min-w-full keeps the colspan cell out of the
                        auto table layout so opening a row never resizes
                        the columns above it. */}
                    <dl className="w-0 min-w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg bg-secondary/60 p-4">
                      <DetailField label="Avkastning 1 md" value={pct(h.performanceOneMonth)} />
                      <DetailField label="Avkastning 5 år" value={pct(h.performanceFiveYears)} />
                      <DetailField label="Referanseindeks" value={h.benchmark ?? "-"} />
                      <DetailField label="Kategori" value={h.category ?? "-"} />
                      <DetailField label="ISIN" value={h.isin ?? "-"} />
                      <DetailField
                        label="Sist handlet"
                        value={new Date(h.lastTradeDate).toLocaleDateString("nb-NO")}
                      />
                    </dl>
                  </td>
                </tr>
              )}
              </Fragment>
              );
            })}
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
