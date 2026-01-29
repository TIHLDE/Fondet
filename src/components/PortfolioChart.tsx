"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

interface PortfolioEntry {
  date: string;
  fund: number;
  benchmark: number;
}

interface StocksData {
  portfolio: PortfolioEntry[];
  allocation: { fund: string; allocation: number; category: string }[];
}

const TIME_RANGES = [
  { label: "1 MD.", months: 1 },
  { label: "3 MD.", months: 3 },
  { label: "6 MD.", months: 6 },
  { label: "I \u00C5R", months: -1 },
  { label: "1 \u00C5R", months: 12 },
  { label: "3 \u00C5R", months: 36 },
  { label: "5 \u00C5R", months: 60 },
];

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nb-NO", { month: "short", year: "numeric" });
}

function filterByRange(
  data: PortfolioEntry[],
  months: number,
): PortfolioEntry[] {
  if (data.length === 0) return data;
  // Use the latest data point as the reference, not the current real date
  const latest = new Date(data[data.length - 1].date);
  let cutoff: Date;
  if (months === -1) {
    // "I ÅR" = year-to-date of the latest data point's year
    cutoff = new Date(latest.getFullYear(), 0, 1);
  } else {
    cutoff = new Date(latest);
    cutoff.setMonth(cutoff.getMonth() - months);
  }
  const filtered = data.filter((e) => new Date(e.date) >= cutoff);
  return filtered.length > 0 ? filtered : data;
}

export default function PortfolioChart() {
  const [selectedRange, setSelectedRange] = useState(5);

  const { data, isLoading, error } = useQuery<StocksData>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  const chartData = useMemo(() => {
    if (!data?.portfolio?.length) return [];
    const filtered = filterByRange(
      data.portfolio,
      TIME_RANGES[selectedRange].months,
    );
    return filtered.map((e) => ({
      ...e,
      label: formatDateLabel(e.date),
    }));
  }, [data, selectedRange]);

  const latestReturn =
    chartData.length > 0 ? chartData[chartData.length - 1].fund : 0;

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        Laster porteføljegraf...
      </div>
    );
  }

  if (error || !data?.portfolio?.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Fondets avkastning
        </h2>
        <span
          className={`text-3xl font-bold ${latestReturn >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {latestReturn >= 0 ? "+" : ""}
          {latestReturn.toFixed(1)}%
        </span>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="rgba(255,255,255,0.12)"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              stroke="transparent"
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
            />
            <ReferenceLine
              y={0}
              stroke="rgba(255,255,255,0.35)"
              strokeDasharray="6 4"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: 13,
              }}
              formatter={(
                value: number | undefined,
                name: string | undefined,
              ) => {
                const v = value ?? 0;
                const label =
                  name === "fund" ? "TIHLDE-Fondet" : "Hovedindeksen (OSEBX)";
                return [`${v >= 0 ? "+" : ""}${v.toFixed(1)}%`, label];
              }}
              labelFormatter={(label) => label}
            />
            <Legend
              verticalAlign="bottom"
              formatter={(value: string) =>
                value === "fund" ? "TIHLDE-Fondet" : "Hovedindeksen (OSEBX)"
              }
              wrapperStyle={{ color: "#94a3b8", fontSize: 13, paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="fund"
              stroke="#4ade80"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#4ade80" }}
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#93c5fd"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#93c5fd" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {TIME_RANGES.map((range, i) => (
          <button
            key={range.label}
            onClick={() => setSelectedRange(i)}
            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
              i === selectedRange ?
                "bg-white text-black border-white font-bold"
              : "border-gray-500 text-gray-300 hover:text-white hover:border-gray-300"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
