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

// Graded Finviz-style scale: stronger move this year = brighter shade, so the
// map shows magnitude, not only direction. Slate when we have no live return.
// Every fill keeps white labels at 6.2:1 or better; brighter shades than
// these washed the text out even when they technically passed 4.5:1.
const SCALE_DOWN = ["#b91c1c", "#991b1b", "#6b2020"]; // <= -8, -8..-3, -3..0
const SCALE_UP = ["#1d4a2f", "#166534", "#12703a"]; // 0..3, 3..8, >= 8
const NO_DATA_COLOR = "#475569";

function perfColor(perf: number | null): string {
  if (perf === null) return NO_DATA_COLOR;
  if (perf >= 8) return SCALE_UP[2];
  if (perf >= 3) return SCALE_UP[1];
  if (perf >= 0) return SCALE_UP[0];
  if (perf > -3) return SCALE_DOWN[2];
  if (perf > -8) return SCALE_DOWN[1];
  return SCALE_DOWN[0];
}

// Break a fund name into at most two lines that fit the tile, splitting on
// spaces. Ellipsis only when a line still cannot fit, so "Fondsfinans
// Utbytte" wraps instead of becoming "Fondsfinans Utb…".
function wrapName(name: string, maxChars: number): string[] {
  if (name.length <= maxChars) return [name];
  const words = name.split(" ");
  const lines: string[] = [];
  let cur = "";
  let i = 0;
  while (i < words.length && lines.length < 2) {
    const next = cur ? `${cur} ${words[i]}` : words[i];
    if (next.length <= maxChars) {
      cur = next;
      i++;
    } else if (cur) {
      lines.push(cur);
      cur = "";
    } else {
      cur = words[i];
      i++;
      break;
    }
  }
  if (cur && lines.length < 2) lines.push(cur);
  if (i < words.length || cur.length > maxChars) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] =
      last.length >= maxChars ? `${last.slice(0, maxChars - 1)}…` : `${last}…`;
  }
  return lines;
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
      <div className="text-xs mt-0.5" style={{ opacity: 0.8 }}>
        {fund.perf !== null ? `${fmtPerf(fund.perf)} i år` : "Ingen live kursdata"}
      </div>
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
  // Fit to what the tile can actually hold (~8px per char at 14px bold): the
  // name wraps onto a second line before it truncates, and every line stays
  // inside the tile so nothing spills past the chart edge.
  const maxChars = Math.floor((width - 16) / 8);
  const showLabel = !!name && maxChars >= 4 && height > 40;
  const nameLines = showLabel ? wrapName(name, maxChars) : [];
  const twoNameLines = nameLines.length > 1 && height > 62;
  const shownNameLines = twoNameLines ? nameLines : nameLines.slice(0, 1);
  if (!twoNameLines && nameLines.length > 1 && shownNameLines[0]) {
    const first = shownNameLines[0];
    shownNameLines[0] = first.endsWith("…")
      ? first
      : first.length >= maxChars
        ? `${first.slice(0, maxChars - 1)}…`
        : `${first}…`;
  }
  const detailY = twoNameLines ? 57 : 40;
  const showDetail = height > detailY + 16;
  const detail =
    weight !== undefined
      ? `${fmt(weight)}${perf !== null ? ` · ${fmtPerf(perf)}` : ""}`
      : "";
  const maxDetailChars = Math.floor((width - 16) / 7);
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
          {shownNameLines.map((line, i) => (
            <text
              key={i}
              x={x + 8}
              y={y + 21 + i * 17}
              fill="#ffffff"
              fontSize={14}
              fontWeight={700}
            >
              {line}
            </text>
          ))}
          {showDetail && detail.length <= maxDetailChars && (
            <text
              x={x + 8}
              y={y + detailY}
              fill="#ffffff"
              fontSize={12.5}
              fontWeight={600}
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
          <span className="flex-1 min-w-0 break-words text-foreground-primary">
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
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
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
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-secondary">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex" aria-hidden>
                {[...SCALE_DOWN, ...SCALE_UP].map((c) => (
                  <span
                    key={c}
                    className="h-3 w-4 first:rounded-l-sm last:rounded-r-sm"
                    style={{ background: c }}
                  />
                ))}
              </span>
              <span>
                Avkastning i år, fra under -8 % (venstre) til over +8 % (høyre)
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: NO_DATA_COLOR }}
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
