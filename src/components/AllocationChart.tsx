"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AllocationEntry {
  fund: string;
  allocation: number;
  category: string;
}

interface StocksData {
  portfolio: { date: string; value: number }[];
  allocation: AllocationEntry[];
}

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];

export default function AllocationChart() {
  const { data, isLoading, error } = useQuery<StocksData>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-foreground-secondary">
        Laster allokeringsgraf...
      </div>
    );
  }

  if (error || !data?.allocation?.length) {
    return null;
  }

  const chartData = data.allocation.map((e) => ({
    name: e.fund,
    value: e.allocation,
  }));

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-4">
      <div className="w-full lg:w-1/2 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-background)",
                border: "1px solid var(--card-border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}%`, "Andel"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full lg:w-1/2">
        <ul className="space-y-2">
          {data.allocation.map((entry, i) => (
            <li key={entry.fund} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-foreground-secondary">
                {entry.fund} — {entry.allocation}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
