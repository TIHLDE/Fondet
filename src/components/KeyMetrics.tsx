"use client";

import { Layers, Star, Leaf, TrendingUp, type LucideIcon } from "lucide-react";
import { useNordnet } from "./NordnetProfileCard";
import { useCountUp, useInView } from "@/lib/anim";

function StatCard({
  icon: Icon,
  label,
  value,
  inView,
  format,
  sub,
  valueClass = "text-foreground-primary",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  inView: boolean;
  format: (n: number) => string;
  sub?: string;
  valueClass?: string;
}) {
  const n = useCountUp(value, inView);
  return (
    <div className="rounded-lg border border-cardBorder bg-cardBackground p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <span
          className={`text-3xl sm:text-4xl font-extrabold tabular-nums ${valueClass}`}
        >
          {format(n)}
        </span>
        <Icon className="w-5 h-5 text-accent shrink-0 mt-1" aria-hidden />
      </div>
      <div className="mt-2 text-sm font-medium text-foreground-primary">
        {label}
      </div>
      {sub && (
        <div className="mt-0.5 text-xs text-foreground-secondary truncate">
          {sub}
        </div>
      )}
    </div>
  );
}

export default function KeyMetrics() {
  const { data, isLoading } = useNordnet();
  const [ref, inView] = useInView<HTMLDivElement>();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-lg bg-cardBackground border border-cardBorder animate-pulse"
          />
        ))}
      </div>
    );
  }

  const holdings = data?.holdings ?? [];
  if (holdings.length === 0) return null;

  const ratings = holdings
    .map((h) => h.rating)
    .filter((r): r is number => r !== null);
  const avgRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  const esgCount = holdings.filter(
    (h) => h.esgArticle === 8 || h.esgArticle === 9,
  ).length;
  const esgPct = Math.round((100 * esgCount) / holdings.length);

  const withYtd = holdings.filter((h) => h.performanceThisYear !== null);
  const best = withYtd.length
    ? withYtd.reduce((a, b) =>
        b.performanceThisYear! > a.performanceThisYear! ? b : a,
      )
    : null;

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Layers}
        inView={inView}
        value={holdings.length}
        format={(n) => Math.round(n).toString()}
        label="Fond i porteføljen"
      />
      <StatCard
        icon={Star}
        inView={inView}
        value={avgRating}
        format={(n) => n.toFixed(1).replace(".", ",")}
        label="Snitt Morningstar"
        sub={`${"★".repeat(Math.round(avgRating))} av 5`}
      />
      <StatCard
        icon={Leaf}
        inView={inView}
        value={esgPct}
        format={(n) => `${Math.round(n)} %`}
        label="ESG-dekning"
        sub={`${esgCount} av ${holdings.length} fond`}
      />
      {best && best.performanceThisYear !== null && (
        <StatCard
          icon={TrendingUp}
          inView={inView}
          value={best.performanceThisYear}
          format={(n) =>
            `${n >= 0 ? "+" : ""}${n.toFixed(1).replace(".", ",")} %`
          }
          label="Best i år"
          sub={best.name}
          valueClass={
            best.performanceThisYear >= 0
              ? "text-success"
              : "text-red-600 dark:text-red-400"
          }
        />
      )}
    </div>
  );
}
