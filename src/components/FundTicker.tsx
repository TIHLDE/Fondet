"use client";

import { useNordnet } from "./NordnetProfileCard";
import { usePrefersReducedMotion } from "@/lib/anim";

type Item = { name: string; perf: number };

const UP = "#22c55e";
const DOWN = "#f7525f";

function Pill({ name, perf }: Item) {
  const up = perf >= 0;
  return (
    <span className="inline-flex items-center gap-2 px-5 text-sm">
      <span className="text-foreground-secondary whitespace-nowrap">{name}</span>
      <span
        className="tabular-nums whitespace-nowrap"
        style={{ color: up ? UP : DOWN }}
      >
        {up ? "▲" : "▼"} {up ? "+" : ""}
        {perf.toFixed(1).replace(".", ",")} %
      </span>
      <span className="text-cardBorder" aria-hidden>
        |
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

  const band =
    "ticker-band w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] border-y";

  if (reduce) {
    return (
      <div className={`${band} py-2`} role="marquee" aria-label={label}>
        <div className="flex flex-wrap justify-center gap-y-1 px-4">
          {items.map((it) => (
            <Pill key={it.name} {...it} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ticker ${band} overflow-hidden py-2`}
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
