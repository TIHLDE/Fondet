"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Treemap,
} from "recharts";
import { PieChart as PieIcon, LayoutGrid } from "lucide-react";
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

function fmtPerf(perf: number): string {
  return `${perf >= 0 ? "+" : ""}${perf.toFixed(1).replace(".", ",")} %`;
}

// Mirrors the matcher in src/lib/fordeling.ts (which is server-only): the
// report and Nordnet can disagree on share class letter and NOK suffix for
// the same fund, so both are stripped before comparison.
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bnok\b/g, "")
    .replace(/\s+[a-zæøåö]\s*$/, "")
    .replace(/[^a-zæøå0-9]/g, "");
}

// Green for a fund up this year, red for down, slate when we have no live
// return for it. All three keep white label text above 4.5:1 (WCAG AA);
// green-600 did not, hence green-700.
function perfColor(perf: number | null): string {
  if (perf === null) return "#64748b";
  return perf >= 0 ? "#15803d" : "#dc2626";
}

type TileDatum = FordelingFund & { perf: number | null };

function DonutTooltip({
  active,
  payload,
  dark,
}: {
  active?: boolean;
  payload?: { payload: TileDatum }[];
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
      {fund.perf !== null && (
        <div className="text-xs mt-0.5" style={{ opacity: 0.8 }}>
          {fmtPerf(fund.perf)} i år
        </div>
      )}
    </div>
  );
}

// Recharts hands each treemap node its datum fields plus geometry. Label the
// tile only when it is big enough to read.
function TreemapTile(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  weight?: number;
  perf?: number | null;
  cardBg?: string;
}) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    weight,
    perf = null,
    cardBg = "#ffffff",
  } = props;
  // Truncate to what actually fits the tile (~7.5px per char at 13px
  // semibold) so labels never spill past the tile or the chart edge.
  const maxChars = Math.floor((width - 16) / 7.5);
  const showLabel = !!name && maxChars >= 4 && height > 40;
  const showSecondLine = height > 56;
  const label =
    name && name.length > maxChars ? `${name.slice(0, maxChars - 1)}…` : name;
  const detail =
    weight !== undefined
      ? `${fmt(weight)}${perf !== null ? ` · ${fmtPerf(perf)}` : ""}`
      : "";
  const maxDetailChars = Math.floor((width - 16) / 6.8);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={perfColor(perf)}
        stroke={cardBg}
        strokeWidth={2}
      />
      {showLabel && (
        <>
          <text
            x={x + 8}
            y={y + 20}
            fill="#ffffff"
            fontSize={13}
            fontWeight={600}
          >
            {label}
          </text>
          {showSecondLine && detail.length <= maxDetailChars && (
            <text
              x={x + 8}
              y={y + 38}
              fill="#ffffff"
              fontSize={12}
              opacity={0.9}
            >
              {detail}
            </text>
          )}
        </>
      )}
    </g>
  );
}

function Legend({ funds }: { funds: TileDatum[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
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
  );
}

export default function AllocationDonut() {
  const { data, isLoading } = useNordnet();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const cardBg = dark ? "#1e222d" : "#ffffff";
  const [view, setView] = useState<"donut" | "treemap">("donut");

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

  const raw = [...(data?.fordeling ?? [])].sort((a, b) => b.weight - a.weight);
  if (raw.length === 0) return null;
  const period = data?.weightAsOf;

  // Join each report fund to its live this-year return, matched by name.
  const perfByName = new Map<string, number>();
  for (const h of data?.holdings ?? []) {
    if (h.performanceThisYear !== null) {
      perfByName.set(normalize(h.name), h.performanceThisYear);
    }
  }
  const funds: TileDatum[] = raw.map((f) => ({
    ...f,
    perf: perfByName.get(normalize(f.name)) ?? null,
  }));

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <h2 className="text-2xl font-semibold text-foreground-primary">
            Porteføljefordeling
          </h2>
          {period && (
            <p className="text-sm text-foreground-secondary mt-1">
              Publiserte vekter fra rapporten for {period}
              {view === "treemap" && ", flater fargelagt etter avkastning i år"}
            </p>
          )}
        </div>
        <div
          className="flex gap-1 shrink-0"
          role="group"
          aria-label="Velg visning"
        >
          {[
            { key: "donut" as const, label: "Ring", Icon: PieIcon },
            { key: "treemap" as const, label: "Kart", Icon: LayoutGrid },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex items-center gap-1.5 min-h-[40px] rounded px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-primary ${
                view === key
                  ? "bg-foreground-primary text-cardBackground"
                  : "text-foreground-secondary hover:bg-cardBorder/30"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "donut" ? (
        <div className="flex flex-col md:flex-row md:items-center gap-6 mt-5">
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
          <div className="flex-1">
            <Legend funds={funds} />
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div
            className="h-80 w-full"
            role="img"
            aria-label={`Porteføljekart per ${period ?? "siste rapport"}. Flatestørrelse etter vekt, farge etter avkastning i år.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                // recharts wants an index-signature row shape; our typed rows carry the same fields.
                data={funds as unknown as Record<string, unknown>[]}
                dataKey="weight"
                aspectRatio={4 / 3}
                stroke={cardBg}
                isAnimationActive={false}
                content={<TreemapTile cardBg={cardBg} />}
              >
                <Tooltip content={<DonutTooltip dark={dark} />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-foreground-secondary">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: "#15803d" }}
                aria-hidden
              />
              Opp i år
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: "#dc2626" }}
                aria-hidden
              />
              Ned i år
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: "#64748b" }}
                aria-hidden
              />
              Ingen live kurs
            </span>
          </div>
          {/* Small tiles drop their visual label, so give screen readers the
              full list the chart itself cannot. */}
          <ul className="sr-only">
            {funds.map((f) => (
              <li key={f.name}>
                {f.name}: {fmt(f.weight)}
                {f.perf !== null ? `, ${fmtPerf(f.perf)} i år` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
