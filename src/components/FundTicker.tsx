"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNordnet } from "./NordnetProfileCard";
import { usePrefersReducedMotion } from "@/lib/anim";

type Item = { name: string; perf: number };

function Pill({ name, perf }: Item) {
  const up = perf >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const color = up ? "text-success" : "text-red-600 dark:text-red-400";
  return (
    <span className="inline-flex items-center gap-1.5 px-4 text-sm">
      <span className="text-foreground-primary">{name}</span>
      <span className={`inline-flex items-center gap-0.5 tabular-nums ${color}`}>
        <Arrow className="w-3.5 h-3.5" aria-hidden />
        {up ? "+" : ""}
        {perf.toFixed(1).replace(".", ",")} %
      </span>
      <span className="text-cardBorder" aria-hidden>
        ·
      </span>
    </span>
  );
}

export default function FundTicker() {
  const { data, isLoading } = useNordnet();
  const reduce = usePrefersReducedMotion();

  if (isLoading) return null;

  const items: Item[] = (data?.holdings ?? [])
    .filter((h): h is typeof h & { performanceThisYear: number } =>
      h.performanceThisYear !== null,
    )
    .map((h) => ({ name: h.name, perf: h.performanceThisYear }));

  if (items.length === 0) return null;

  const label = "Avkastning hittil i år per fond";

  // Reduced motion: a static, wrapping row instead of a moving marquee.
  if (reduce) {
    return (
      <div
        className="ticker rounded-lg border border-cardBorder bg-cardBackground/60 py-2"
        role="marquee"
        aria-label={label}
      >
        <div className="flex flex-wrap justify-center gap-y-1">
          {items.map((it) => (
            <Pill key={it.name} {...it} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticker overflow-hidden rounded-lg border border-cardBorder bg-cardBackground/60 py-2"
      role="marquee"
      aria-label={label}
    >
      <div className="ticker-track whitespace-nowrap">
        {/* Two identical copies so the -50% translate loops seamlessly. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="inline-flex" aria-hidden={copy === 1}>
            {items.map((it) => (
              <Pill key={it.name} {...it} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
