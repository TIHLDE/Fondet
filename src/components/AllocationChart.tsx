"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StocksData {
  portfolio: { date: string; fund: number; benchmark: number }[];
  allocation: { fund: string; allocation: number; category: string }[];
}

const COLORS = [
  "#f87171",
  "#d4a574",
  "#d4d46a",
  "#6dd4a0",
  "#6dd4d4",
  "#7b8dcd",
  "#a07bcd",
  "#e47baa",
];

export default function AllocationChart() {
  const { data, isLoading, error } = useQuery<StocksData>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
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
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Fondets sammensetning
      </h2>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full lg:w-1/2 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={1.5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  fontSize: 13,
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number | undefined) => [
                  `${value ?? 0}%`,
                  "Andel",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2">
          <ul className="space-y-3">
            {data.allocation.map((entry, i) => (
              <li key={entry.fund} className="flex items-center gap-3 text-sm">
                <span
                  className="inline-block w-5 h-4 rounded-sm shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-gray-200">
                  {entry.fund}: {entry.allocation}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
