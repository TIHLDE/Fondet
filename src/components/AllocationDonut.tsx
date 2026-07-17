"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNordnet } from "./NordnetProfileCard";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Skeleton } from "@/components/ui/skeleton";
import type { FordelingFund } from "@/lib/nordnet-types";

// Mid-tone hues that stay legible against both the light and dark card
// backgrounds. Cycled if there are ever more funds than colors.
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

function fmt(weight: number): string {
  return `${weight.toFixed(2).replace(".", ",")} %`;
}

function DonutTooltip({
  active,
  payload,
  dark,
}: {
  active?: boolean;
  payload?: { payload: FordelingFund }[];
  dark: boolean;
}) {
  if (!active || !payload?.length) return null;
  const fund = payload[0].payload;
  return (
    <div
      className="rounded-md border px-3 py-2 text-sm shadow-lg"
      style={{
        background: dark ? "#1e222d" : "#ffffff",
        borderColor: dark ? "#2b2f3a" : "#e5e7eb",
        color: dark ? "#f3f4f6" : "#111827",
      }}
    >
      <div className="font-medium">{fund.name}</div>
      <div>{fmt(fund.weight)}</div>
    </div>
  );
}

export default function AllocationDonut() {
  const { data, isLoading } = useNordnet();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-8 w-64 max-w-full mb-2" />
        <Skeleton className="h-4 w-72 max-w-full mb-6" />
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-64 w-full md:w-64 shrink-0 flex items-center justify-center">
            <Skeleton className="h-56 w-56 rounded-full" />
          </div>
          <div className="flex-1 space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-3 h-3 rounded-sm shrink-0" />
                <Skeleton className="h-4 flex-1 max-w-64" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const funds = [...(data?.fordeling ?? [])].sort((a, b) => b.weight - a.weight);
  if (funds.length === 0) return null;
  const period = data?.weightAsOf;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-1">
        Porteføljefordeling
      </h2>
      {period && (
        <p className="text-sm text-foreground-secondary mb-6">
          Publiserte vekter fra rapporten for {period}
        </p>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div
          className="h-64 w-full md:w-64 shrink-0"
          role="img"
          aria-label={`Porteføljefordeling per ${period ?? "siste rapport"}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={funds}
                dataKey="weight"
                nameKey="name"
                innerRadius="58%"
                outerRadius="90%"
                paddingAngle={1}
                stroke="none"
              >
                {funds.map((f, i) => (
                  <Cell key={f.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip dark={dark} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {funds.map((f, i) => (
            <li key={f.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
                aria-hidden
              />
              <span className="flex-1 min-w-0 truncate text-foreground-primary">
                {f.name}
              </span>
              <span className="text-foreground-secondary tabular-nums">
                {fmt(f.weight)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
