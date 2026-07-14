"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createChart,
  LineSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useNordnet } from "./NordnetProfileCard";
import { useTheme } from "@/components/providers/ThemeProvider";
import { equalWeightComposite } from "@/lib/series";
import type { Series, SeriesResponse } from "@/lib/nordnet-types";

const PERIODS = [
  { key: "MONTH_1", label: "1 md.", days: 31 },
  { key: "MONTH_3", label: "3 md.", days: 92 },
  { key: "MONTH_6", label: "6 md.", days: 183 },
  { key: "YEAR_1", label: "1 år", days: 366 },
  { key: "YEAR_3", label: "3 år", days: 1096 },
  { key: "YEAR_5", label: "5 år", days: 1827 },
  { key: "YEAR_10", label: "10 år", days: 3653 },
];

const INDEXES = ["OSEBX", "OMXS30", "OMXC25", "S&P 500"];
const FUND_LABEL = "TIHLDE-Fondet (likevektet)";

const FUND_COLOR = "#00c896";
const LINE_COLORS = [
  "#4d8bff",
  "#ffa726",
  "#a78bfa",
  "#f06292",
  "#22d3ee",
  "#ffe14d",
  "#818cf8",
  "#2dd4bf",
  "#ff8a65",
  "#b9bdc9",
];

export default function FundPerformanceChart() {
  const { data: nordnet } = useNordnet();
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "light" ? "#5d606b" : "#9598a1";
  const gridColor =
    resolvedTheme === "light"
      ? "rgba(93, 96, 107, 0.15)"
      : "rgba(149, 152, 161, 0.15)";
  const [period, setPeriod] = useState("YEAR_1");
  const [hidden, setHidden] = useState<Set<string> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map());

  const fundsParam = useMemo(() => {
    if (!nordnet?.holdings?.length) return "";
    return nordnet.holdings
      .map((h) => `${h.orderBookId}:${h.name}`)
      .join(",");
  }, [nordnet]);

  const { data, isLoading } = useQuery<SeriesResponse>({
    queryKey: ["nordnet-series", period, fundsParam],
    queryFn: () =>
      fetch(
        `/api/nordnet/series?period=${period}&funds=${encodeURIComponent(fundsParam)}&indexes=${encodeURIComponent(INDEXES.join(","))}`,
      ).then((r) => r.json()),
    enabled: fundsParam.length > 0,
    staleTime: 1000 * 60 * 30,
  });

  const fondetSeries = useMemo<Series | null>(() => {
    const funds = (data?.series ?? []).filter((s) => s.kind === "fund");
    return equalWeightComposite(funds, FUND_LABEL);
  }, [data]);

  const allSeries = useMemo<Series[]>(() => {
    const rest = data?.series ?? [];
    return fondetSeries ? [fondetSeries, ...rest] : rest;
  }, [fondetSeries, data]);

  // Default visibility once data is in: the fund line (when present) plus
  // OSEBX; individual holdings stay available behind the toggles.
  useEffect(() => {
    if (hidden !== null || allSeries.length === 0) return;
    const defaults = new Set<string>();
    for (const s of allSeries) {
      const isDefault =
        s.label === FUND_LABEL ||
        s.label === "OSEBX" ||
        (!fondetSeries && s.kind === "fund");
      if (!isDefault) defaults.add(s.label);
    }
    setHidden(defaults);
  }, [allSeries, hidden, fondetSeries]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: axisColor,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: gridColor },
      },
      localization: {
        locale: "nb-NO",
        priceFormatter: (v: number) => `${v.toFixed(1)} %`,
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = chart;
    const series = seriesRef.current;

    return () => {
      chart.remove();
      chartRef.current = null;
      series.clear();
    };
    // theme changes are handled by the applyOptions effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chartRef.current?.applyOptions({
      layout: { textColor: axisColor },
      grid: { horzLines: { color: gridColor } },
    });
  }, [axisColor, gridColor]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || allSeries.length === 0) return;

    for (const s of Array.from(seriesRef.current.values())) {
      chart.removeSeries(s);
    }
    seriesRef.current.clear();

    allSeries.forEach((s, i) => {
      const isFondet = s.label === FUND_LABEL;
      const line = chart.addSeries(LineSeries, {
        color: isFondet
          ? FUND_COLOR
          : LINE_COLORS[(fondetSeries ? i - 1 : i) % LINE_COLORS.length],
        lineWidth: isFondet ? 3 : 2,
        priceLineVisible: false,
        lastValueVisible: false,
        visible: !hidden?.has(s.label),
      });
      line.setData(
        s.points.map((p) => ({
          time: Math.floor(p.time / 1000) as UTCTimestamp,
          value: p.value,
        })),
      );
      seriesRef.current.set(s.label, line);
    });
    chart.timeScale().fitContent();
    // visibility is kept in sync by the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSeries]);

  useEffect(() => {
    if (!hidden) return;
    for (const [label, line] of Array.from(seriesRef.current.entries())) {
      line.applyOptions({ visible: !hidden.has(label) });
    }
  }, [hidden]);

  function toggle(label: string) {
    setHidden((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function colorFor(label: string, index: number) {
    if (label === FUND_LABEL) return FUND_COLOR;
    return LINE_COLORS[(fondetSeries ? index - 1 : index) % LINE_COLORS.length];
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-2xl font-semibold text-foreground-primary">
          Utvikling
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                period === p.key
                  ? "bg-button-background text-button-foreground border-button-border"
                  : "border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="w-full h-80" />
      {isLoading && (
        <p className="text-sm text-foreground-secondary mt-2">
          Laster kursdata fra Nordnet...
        </p>
      )}

      {allSeries.length > 0 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
          {allSeries.map((s, i) => (
            <button
              key={s.label}
              onClick={() => toggle(s.label)}
              aria-pressed={!hidden?.has(s.label)}
              className={`inline-flex shrink-0 items-center gap-2 px-3 py-2 text-xs whitespace-nowrap rounded-full border transition-colors ${
                hidden?.has(s.label)
                  ? "border-cardBorder text-foreground-secondary opacity-60"
                  : "border-cardBorder text-foreground-primary"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colorFor(s.label, i) }}
                aria-hidden
              />
              {s.label}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
