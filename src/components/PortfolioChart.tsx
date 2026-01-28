"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PortfolioEntry {
  date: string;
  value: number;
}

interface StocksData {
  portfolio: PortfolioEntry[];
  allocation: { fund: string; allocation: number; category: string }[];
}

function formatValue(value: number) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nb-NO", { month: "short", year: "numeric" });
}

export default function PortfolioChart() {
  const { data, isLoading, error } = useQuery<StocksData>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-foreground-secondary">
        Laster porteføljegraf...
      </div>
    );
  }

  if (error || !data?.portfolio?.length) {
    return null;
  }

  const chartData = data.portfolio.map((e) => ({
    ...e,
    label: formatDate(e.date),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--foreground-secondary)", fontSize: 12 }}
            stroke="var(--card-border)"
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            tick={{ fill: "var(--foreground-secondary)", fontSize: 12 }}
            stroke="var(--card-border)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card-background)",
              border: "1px solid var(--card-border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
            formatter={(value: number | undefined) => [formatValue(value ?? 0), "Verdi"]}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ fill: "var(--accent)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
