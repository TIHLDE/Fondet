"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { NordnetData } from "@/lib/nordnet-types";

function relative(fromMs: number, nowMs: number): string {
  const mins = Math.max(0, Math.floor((nowMs - fromMs) / 60000));
  if (mins < 1) return "nettopp";
  if (mins < 60) return `for ${mins} min siden`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `for ${hours} ${hours === 1 ? "time" : "timer"} siden`;
  const days = Math.floor(hours / 24);
  return `for ${days} ${days === 1 ? "dag" : "dager"} siden`;
}

export default function DataFreshness() {
  // Reads the same cached query as the rest of the page, so no extra fetch.
  const { dataUpdatedAt, isLoading, isError } = useQuery<NordnetData>({
    queryKey: ["nordnet"],
    queryFn: () => fetch("/api/nordnet").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  // Re-render every 30s so the relative time keeps up without a live clock.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  if (isLoading || isError || !dataUpdatedAt || now === null) return null;

  return (
    <p className="inline-flex items-center gap-2 text-sm text-foreground-secondary">
      <span className="relative inline-flex h-2.5 w-2.5" aria-hidden>
        <span className="freshness-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
      </span>
      Live data, oppdatert {relative(dataUpdatedAt, now)}
    </p>
  );
}
