"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StocksData {
  portfolio: { date: string; fund: number; benchmark: number }[];
  allocation: { fund: string; allocation: number; category: string }[];
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
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
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="#1e293b"
                strokeWidth={2}
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  fontSize: 14,
                  padding: "12px 16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                }}
                itemStyle={{ color: "#fff", fontWeight: 500 }}
                formatter={(value: number | undefined, name: string) => [
                  `${value ?? 0}%`,
                  name,
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
                  className="inline-block w-5 h-5 rounded shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-gray-100 font-medium">
                  {entry.fund}
                </span>
                <span className="text-gray-400 ml-auto">
                  {entry.allocation}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
