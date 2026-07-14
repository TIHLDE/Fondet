"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNordnet } from "./NordnetProfileCard";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Holding } from "@/lib/nordnet-types";

const METRICS = [
  { key: "performanceOneMonth", label: "1 md." },
  { key: "performanceThisYear", label: "I år" },
  { key: "performanceThreeYears", label: "3 år" },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

export default function PerformanceBars() {
  const { data, isLoading } = useNordnet();
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "light" ? "#5d606b" : "#9598a1";
  const [metric, setMetric] = useState<MetricKey>("performanceThisYear");
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const holdings = data?.holdings ?? [];
  if (isLoading || holdings.length === 0) return null;

  const bars = holdings
    .filter((h: Holding) => h[metric] !== null)
    .map((h: Holding) => ({ name: h.name, value: h[metric] as number }))
    .sort((a, b) => b.value - a.value);

  if (bars.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-2xl font-semibold text-foreground-primary">
          Avkastning per fond
        </h2>
        <div className="flex gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                metric === m.key
                  ? "bg-button-background text-button-foreground border-button-border"
                  : "border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full" style={{ height: bars.length * 44 + 30 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} layout="vertical" margin={{ left: 8, right: 48 }}>
            <XAxis
              type="number"
              tickFormatter={(v: number) => `${v} %`}
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={narrow ? 120 : 210}
              stroke={axisColor}
              fontSize={narrow ? 12 : 13}
              tickLine={false}
              axisLine={false}
              tickFormatter={(name: string) =>
                narrow && name.length > 18 ? `${name.slice(0, 17)}…` : name
              }
            />
            <ReferenceLine x={0} stroke="rgba(148, 163, 184, 0.4)" />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const bar = payload[0].payload as { name: string; value: number };
                const label = METRICS.find((m) => m.key === metric)?.label;
                const sign = bar.value > 0 ? "+" : "";
                return (
                  <div
                    className="rounded-lg px-3 py-2 text-sm"
                    style={{
                      backgroundColor: "#1e222d",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  >
                    <p className="font-semibold">{bar.name}</p>
                    <p className="text-gray-300">
                      Avkastning {label}: {sign}
                      {bar.value.toFixed(2).replace(".", ",")} %
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 3, 3, 0]}
              barSize={22}
              animationDuration={700}
              animationEasing="ease-out"
            >
              {bars.map((b, i) => (
                <Cell
                  key={i}
                  fill={
                    b.value >= 0
                      ? resolvedTheme === "light"
                        ? "#089981"
                        : "#22ab94"
                      : resolvedTheme === "light"
                        ? "#f23645"
                        : "#f7525f"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
