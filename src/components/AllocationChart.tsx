"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";

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

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={600}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={24} fontWeight={700}>
        {value}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))",
        }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 18}
        outerRadius={outerRadius + 22}
        fill={fill}
        opacity={0.6}
      />
    </g>
  );
};

export default function AllocationChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<StocksData>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-amber-500 animate-spin" />
          </div>
          <span className="text-lg">Laster allokeringsgraf...</span>
        </div>
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

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6 from-white to-gray-400 bg-clip-text text-transparent">
        Fondets sammensetning
      </h2>
      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 h-96 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-2xl" />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex ?? undefined}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="#1e293b"
                strokeWidth={3}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter: activeIndex === index 
                        ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))" 
                        : "brightness(1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2">
          <ul className="space-y-2">
            {data.allocation.map((entry, i) => (
              <li 
                key={entry.fund} 
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer
                  ${activeIndex === i 
                    ? 'bg-slate-700/50 scale-105 shadow-lg shadow-slate-900/50' 
                    : 'hover:bg-slate-700/30 hover:scale-102'
                  }
                `}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span
                  className={`
                    inline-block w-5 h-5 rounded shrink-0 transition-all duration-300
                    ${activeIndex === i ? 'scale-125 shadow-lg' : 'scale-100'}
                  `}
                  style={{ 
                    backgroundColor: COLORS[i % COLORS.length],
                    boxShadow: activeIndex === i 
                      ? `0 0 12px ${COLORS[i % COLORS.length]}` 
                      : 'none',
                  }}
                />
                <span className={`
                  text-sm font-medium transition-all duration-300
                  ${activeIndex === i ? 'text-white font-semibold' : 'text-gray-100'}
                `}>
                  {entry.fund}
                </span>
                <span className={`
                  ml-auto text-sm font-semibold transition-all duration-300
                  ${activeIndex === i ? 'text-white scale-110' : 'text-gray-400'}
                `}>
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
