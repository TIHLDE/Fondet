"use client";

import { useState } from "react";
import Image from "next/image";
import { useNordnet } from "./NordnetProfileCard";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TradesList() {
  const { data, isLoading } = useNordnet();
  const [page, setPage] = useState(0);

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-8 w-48 max-w-full mb-6" />
        <ul className="divide-y divide-cardBorder">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded shrink-0" />
                <Skeleton className="h-4 flex-1 max-w-72" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="hidden sm:block h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const trades = data?.trades ?? [];
  if (trades.length === 0) return null;

  const pageCount = Math.ceil(trades.length / PAGE_SIZE);
  const visible = trades.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-6">
        Siste handler
      </h2>
      <ul className="divide-y divide-cardBorder">
        {visible.map((t, i) => (
          <li key={`${t.date}-${t.legacyInstrumentId}-${i}`} className="py-3">
            <div className="flex items-center gap-3">
              {t.logoUrl && (
                <Image
                  src={t.logoUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded object-contain"
                />
              )}
              <span className="flex-1 min-w-0 truncate text-foreground-primary">
                {t.name}
              </span>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  t.tradeType === "BUY" ? "text-success" : "text-red-600 dark:text-red-400"
                }`}
              >
                {t.tradeType === "BUY" ? "Kjøp" : "Salg"}
              </span>
              <span className="hidden sm:block w-28 text-right text-foreground-secondary text-sm whitespace-nowrap tabular-nums">
                {t.price.toLocaleString("nb-NO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="w-24 text-right text-foreground-secondary text-sm whitespace-nowrap">
                {formatDate(t.date)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Forrige
          </button>
          <span className="text-sm text-foreground-secondary">
            Side {page + 1} av {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Neste
          </button>
        </div>
      )}
    </div>
  );
}
