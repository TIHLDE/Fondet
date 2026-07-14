"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createChart,
  LineSeries,
  ColorType,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type IPriceLine,
  type MouseEventParams,
  type UTCTimestamp,
} from "lightweight-charts";
import { Check, ChevronDown, Maximize2, Minimize2, Trash2 } from "lucide-react";
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
const FUND_LABEL = "TIHLDE-fondet";

const FUND_COLOR = "#00c896";
const INDEX_COLORS: Record<string, string> = {
  OSEBX: "#4d8bff",
  OMXS30: "#ffa726",
  OMXC25: "#a78bfa",
  "S&P 500": "#f06292",
};

type Point = { time: number; value: number };

function sma(points: Point[], n: number): Point[] {
  const out: Point[] = [];
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    sum += points[i].value;
    if (i >= n) sum -= points[i - n].value;
    if (i >= n - 1) out.push({ time: points[i].time, value: sum / n });
  }
  return out;
}

function ema(points: Point[], n: number): Point[] {
  if (points.length === 0) return [];
  const k = 2 / (n + 1);
  const out: Point[] = [];
  let value = points[0].value;
  for (let i = 1; i < points.length; i++) {
    value = points[i].value * k + value * (1 - k);
    if (i >= n - 1) out.push({ time: points[i].time, value });
  }
  return out;
}

function bollinger(points: Point[], n: number, mult: number) {
  const mid: Point[] = [];
  const upper: Point[] = [];
  const lower: Point[] = [];
  for (let i = n - 1; i < points.length; i++) {
    const window = points.slice(i - n + 1, i + 1).map((p) => p.value);
    const mean = window.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(
      window.reduce((a, b) => a + (b - mean) ** 2, 0) / n,
    );
    mid.push({ time: points[i].time, value: mean });
    upper.push({ time: points[i].time, value: mean + mult * sd });
    lower.push({ time: points[i].time, value: mean - mult * sd });
  }
  return { mid, upper, lower };
}

function rsi(points: Point[], n: number): Point[] {
  if (points.length <= n) return [];
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= n; i++) {
    const d = points[i].value - points[i - 1].value;
    if (d > 0) gain += d;
    else loss -= d;
  }
  let avgGain = gain / n;
  let avgLoss = loss / n;
  const out: Point[] = [];
  const value = (g: number, l: number) =>
    l === 0 ? 100 : 100 - 100 / (1 + g / l);
  out.push({ time: points[n].time, value: value(avgGain, avgLoss) });
  for (let i = n + 1; i < points.length; i++) {
    const d = points[i].value - points[i - 1].value;
    avgGain = (avgGain * (n - 1) + Math.max(d, 0)) / n;
    avgLoss = (avgLoss * (n - 1) + Math.max(-d, 0)) / n;
    out.push({ time: points[i].time, value: value(avgGain, avgLoss) });
  }
  return out;
}

type IndicatorLine = {
  color: string;
  dashed: boolean;
  pane: number;
  points: Point[];
};

const INDICATORS: {
  key: string;
  color: string;
  lines: (p: Point[]) => IndicatorLine[];
}[] = [
  ...[20, 50, 200].map((n) => ({
    key: `SMA ${n}`,
    color: { 20: "#ffe14d", 50: "#ff8a65", 200: "#c084fc" }[n]!,
    lines: (p: Point[]) => [
      {
        color: { 20: "#ffe14d", 50: "#ff8a65", 200: "#c084fc" }[n]!,
        dashed: true,
        pane: 0,
        points: sma(p, n),
      },
    ],
  })),
  ...[20, 50, 200].map((n) => ({
    key: `EMA ${n}`,
    color: { 20: "#818cf8", 50: "#2dd4bf", 200: "#fb7185" }[n]!,
    lines: (p: Point[]) => [
      {
        color: { 20: "#818cf8", 50: "#2dd4bf", 200: "#fb7185" }[n]!,
        dashed: true,
        pane: 0,
        points: ema(p, n),
      },
    ],
  })),
  {
    key: "Bollinger 20",
    color: "#64b5f6",
    lines: (p: Point[]) => {
      const b = bollinger(p, 20, 2);
      return [b.upper, b.mid, b.lower].map((points) => ({
        color: "#64b5f6",
        dashed: true,
        pane: 0,
        points,
      }));
    },
  },
  {
    key: "RSI 14",
    color: "#e879f9",
    lines: (p: Point[]) => [
      { color: "#e879f9", dashed: false, pane: 1, points: rsi(p, 14) },
    ],
  },
];

const TOOLS = [
  { key: "trendline", label: "Trendlinje", clicks: 2 },
  { key: "hline", label: "Horisontal linje", clicks: 1 },
  { key: "fib", label: "Fibonacci", clicks: 2 },
  { key: "long", label: "Long-posisjon", clicks: 2 },
  { key: "short", label: "Short-posisjon", clicks: 2 },
] as const;

type ToolKey = (typeof TOOLS)[number]["key"];

const FIB_LEVELS: { level: number; color: string }[] = [
  { level: 0, color: "#787b86" },
  { level: 0.236, color: "#f23645" },
  { level: 0.382, color: "#ff9800" },
  { level: 0.5, color: "#4caf50" },
  { level: 0.618, color: "#089981" },
  { level: 0.786, color: "#00bcd4" },
  { level: 1, color: "#787b86" },
];

type DrawPoint = { time: number; price: number };
type Drawing = { id: number; tool: ToolKey; p1: DrawPoint; p2?: DrawPoint };

type DrawnLine = {
  label: string;
  color: string;
  width: 2 | 3;
  dashed: boolean;
  pane: number;
  points: Point[];
};

export default function FundPerformanceChart() {
  const { data: nordnet } = useNordnet();
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "light" ? "#5d606b" : "#9598a1";
  const gridColor =
    resolvedTheme === "light"
      ? "rgba(93, 96, 107, 0.15)"
      : "rgba(149, 152, 161, 0.15)";
  const [period, setPeriod] = useState("YEAR_1");
  const [shownIndexes, setShownIndexes] = useState<Set<string>>(
    () => new Set(["OSEBX"]),
  );
  const [shownIndicators, setShownIndicators] = useState<Set<string>>(
    () => new Set(),
  );
  const [openMenu, setOpenMenu] = useState<
    "indexes" | "indicators" | "draw" | null
  >(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const menusRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map());
  const drawingSeriesRef = useRef<ISeriesApi<"Line">[]>([]);
  const priceLinesRef = useRef<{ owner: ISeriesApi<"Line">; line: IPriceLine }[]>(
    [],
  );
  const previewRef = useRef<ISeriesApi<"Line"> | null>(null);
  const activeToolRef = useRef<ToolKey | null>(null);
  const pendingRef = useRef<DrawPoint | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    activeToolRef.current = activeTool;
    if (!activeTool) pendingRef.current = null;
  }, [activeTool]);

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

  const drawn = useMemo<DrawnLine[]>(() => {
    const lines: DrawnLine[] = [];
    if (fondetSeries) {
      lines.push({
        label: FUND_LABEL,
        color: FUND_COLOR,
        width: 3,
        dashed: false,
        pane: 0,
        points: fondetSeries.points,
      });
      for (const ind of INDICATORS) {
        if (!shownIndicators.has(ind.key)) continue;
        ind.lines(fondetSeries.points).forEach((l, i) => {
          lines.push({
            label: `${ind.key}#${i}`,
            color: l.color,
            width: 2,
            dashed: l.dashed,
            pane: l.pane,
            points: l.points,
          });
        });
      }
    }
    for (const s of data?.series ?? []) {
      if (s.kind !== "index" || !shownIndexes.has(s.label)) continue;
      lines.push({
        label: s.label,
        color: INDEX_COLORS[s.label] ?? "#b9bdc9",
        width: 2,
        dashed: false,
        pane: 0,
        points: s.points,
      });
    }
    return lines;
  }, [fondetSeries, data, shownIndexes, shownIndicators]);

  const legend = useMemo(() => {
    const items = [];
    if (fondetSeries) items.push({ label: FUND_LABEL, color: FUND_COLOR });
    for (const ind of INDICATORS) {
      if (shownIndicators.has(ind.key))
        items.push({ label: ind.key, color: ind.color });
    }
    for (const label of INDEXES) {
      if (shownIndexes.has(label))
        items.push({ label, color: INDEX_COLORS[label] });
    }
    return items;
  }, [fondetSeries, shownIndicators, shownIndexes]);

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

    const pointFrom = (param: MouseEventParams): DrawPoint | null => {
      if (param.paneIndex !== 0) return null;
      if (typeof param.time !== "number" || !param.point) return null;
      const fund = series.get(FUND_LABEL);
      if (!fund) return null;
      const price = fund.coordinateToPrice(param.point.y);
      if (price === null) return null;
      return { time: param.time, price };
    };

    const removePreview = () => {
      if (previewRef.current) {
        chart.removeSeries(previewRef.current);
        previewRef.current = null;
      }
    };

    chart.subscribeClick((param) => {
      const tool = activeToolRef.current;
      if (!tool) return;
      const p = pointFrom(param);
      if (!p) return;
      const clicks = TOOLS.find((t) => t.key === tool)?.clicks ?? 2;
      if (clicks === 1) {
        setDrawings((prev) => [...prev, { id: idRef.current++, tool, p1: p }]);
        setActiveTool(null);
        return;
      }
      if (!pendingRef.current) {
        pendingRef.current = p;
        return;
      }
      const p1 = pendingRef.current;
      pendingRef.current = null;
      removePreview();
      setDrawings((prev) => [
        ...prev,
        { id: idRef.current++, tool, p1, p2: p },
      ]);
      setActiveTool(null);
    });

    chart.subscribeCrosshairMove((param) => {
      // setData below re-fires crosshair events synchronously; only react
      // to moves that come from an actual pointer event to avoid recursion
      if (!param.sourceEvent) return;
      const tool = activeToolRef.current;
      const pending = pendingRef.current;
      if (!tool || !pending) return;
      const p = pointFrom(param);
      if (!p || p.time === pending.time) return;
      if (!previewRef.current) {
        previewRef.current = chart.addSeries(LineSeries, {
          color: "#9598a1",
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
      }
      const pts = [pending, p].sort((a, b) => a.time - b.time);
      previewRef.current.setData(
        pts.map((q) => ({
          time: q.time as UTCTimestamp,
          value: q.price,
        })),
      );
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      series.clear();
      drawingSeriesRef.current = [];
      priceLinesRef.current = [];
      previewRef.current = null;
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
    if (!chart || drawn.length === 0) return;

    for (const s of Array.from(seriesRef.current.values())) {
      chart.removeSeries(s);
    }
    seriesRef.current.clear();

    for (const d of drawn) {
      const line = chart.addSeries(
        LineSeries,
        {
          color: d.color,
          lineWidth: d.width,
          lineStyle: d.dashed ? LineStyle.Dashed : LineStyle.Solid,
          priceLineVisible: false,
          lastValueVisible: false,
        },
        d.pane,
      );
      line.setData(
        d.points.map((p) => ({
          time: Math.floor(p.time / 1000) as UTCTimestamp,
          value: p.value,
        })),
      );
      if (d.label === "RSI 14#0") {
        for (const level of [30, 70]) {
          line.createPriceLine({
            price: level,
            color: axisColor,
            lineWidth: 1,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: false,
            title: "",
          });
        }
      }
      seriesRef.current.set(d.label, line);
    }

    // drop leftover empty panes (e.g. after toggling RSI off)
    try {
      const panes = chart.panes();
      for (let i = panes.length - 1; i > 0; i--) {
        if (panes[i].getSeries().length === 0) chart.removePane(i);
      }
      if (panes.length > 1 && panes[1].getSeries().length > 0) {
        panes[1].setHeight(110);
      }
    } catch {
      // pane API differences between minor versions are non-fatal
    }
    chart.timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawn]);

  // (re)render drawings; must also re-run after series rebuild since the
  // horizontal-line price lines live on the fund series
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    for (const s of drawingSeriesRef.current) chart.removeSeries(s);
    drawingSeriesRef.current = [];
    for (const { owner, line } of priceLinesRef.current) {
      try {
        owner.removePriceLine(line);
      } catch {
        // owner series may already have been removed by the rebuild effect
      }
    }
    priceLinesRef.current = [];

    const fund = seriesRef.current.get(FUND_LABEL);

    const segment = (
      p1: DrawPoint,
      p2: DrawPoint,
      color: string,
      width: 1 | 2 = 1,
      axisLabel = false,
    ) => {
      if (p1.time === p2.time) return;
      const s = chart.addSeries(LineSeries, {
        color,
        lineWidth: width,
        priceLineVisible: false,
        lastValueVisible: axisLabel,
        crosshairMarkerVisible: false,
      });
      const pts = [p1, p2].sort((a, b) => a.time - b.time);
      s.setData(
        pts.map((q) => ({ time: q.time as UTCTimestamp, value: q.price })),
      );
      drawingSeriesRef.current.push(s);
    };

    for (const d of drawings) {
      if (d.tool === "hline") {
        if (!fund) continue;
        const line = fund.createPriceLine({
          price: d.p1.price,
          color: "#4d8bff",
          lineWidth: 1,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: "",
        });
        priceLinesRef.current.push({ owner: fund, line });
        continue;
      }
      if (!d.p2) continue;
      if (d.tool === "trendline") {
        segment(d.p1, d.p2, "#4d8bff", 2);
      } else if (d.tool === "fib") {
        for (const { level, color } of FIB_LEVELS) {
          const price = d.p1.price + (d.p2.price - d.p1.price) * level;
          segment(
            { time: d.p1.time, price },
            { time: d.p2.time, price },
            color,
            1,
            true,
          );
        }
      } else if (d.tool === "long" || d.tool === "short") {
        const targetColor = d.tool === "long" ? "#089981" : "#f23645";
        segment(
          d.p1,
          { time: d.p2.time, price: d.p1.price },
          "#9598a1",
          1,
          true,
        );
        segment(
          { time: d.p1.time, price: d.p2.price },
          d.p2,
          targetColor,
          2,
          true,
        );
      }
    }
  }, [drawings, drawn]);

  // close dropdowns on outside click or Escape
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!menusRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  // Escape cancels an in-progress drawing tool
  useEffect(() => {
    if (!activeTool) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      pendingRef.current = null;
      if (previewRef.current && chartRef.current) {
        chartRef.current.removeSeries(previewRef.current);
        previewRef.current = null;
      }
      setActiveTool(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeTool]);

  useEffect(() => {
    const onChange = () =>
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current?.requestFullscreen();
    }
  }

  function toggleIn(set: (fn: (prev: Set<string>) => Set<string>) => void) {
    return (label: string) =>
      set((prev) => {
        const next = new Set(prev);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        return next;
      });
  }
  const toggleIndex = toggleIn(setShownIndexes);
  const toggleIndicator = toggleIn(setShownIndicators);

  const menuButtonClass = (open: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
      open
        ? "border-foreground-secondary text-foreground-primary"
        : "border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary"
    }`;

  const menuItemClass =
    "flex w-full items-center gap-2 rounded px-3 py-2.5 text-sm text-foreground-primary transition-colors hover:bg-background";

  const activeToolLabel = TOOLS.find((t) => t.key === activeTool)?.label;

  return (
    <div
      ref={wrapperRef}
      className={
        fullscreen
          ? "flex h-full w-full flex-col overflow-y-auto bg-background p-4 sm:p-6"
          : "w-full"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-2xl font-semibold text-foreground-primary">
          Utvikling
        </h2>
        <div ref={menusRef} className="flex flex-wrap items-center gap-1.5">
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

          <span
            className="mx-1 hidden h-5 w-px bg-cardBorder sm:block"
            aria-hidden
          />

          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu((m) => (m === "indexes" ? null : "indexes"))
              }
              aria-expanded={openMenu === "indexes"}
              aria-haspopup="menu"
              className={menuButtonClass(openMenu === "indexes")}
            >
              Sammenlign
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </button>
            {openMenu === "indexes" && (
              <div
                role="menu"
                aria-label="Sammenligningsindekser"
                className="absolute right-0 top-full z-20 mt-1 min-w-44 rounded-md border border-cardBorder bg-cardBackground p-1 shadow-lg"
              >
                {INDEXES.map((label) => (
                  <button
                    key={label}
                    role="menuitemcheckbox"
                    aria-checked={shownIndexes.has(label)}
                    onClick={() => toggleIndex(label)}
                    className={menuItemClass}
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${shownIndexes.has(label) ? "" : "invisible"}`}
                      aria-hidden
                    />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: INDEX_COLORS[label] }}
                      aria-hidden
                    />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu((m) => (m === "indicators" ? null : "indicators"))
              }
              aria-expanded={openMenu === "indicators"}
              aria-haspopup="menu"
              className={menuButtonClass(openMenu === "indicators")}
            >
              Indikatorer
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </button>
            {openMenu === "indicators" && (
              <div
                role="menu"
                aria-label="Tekniske indikatorer"
                className="absolute right-0 top-full z-20 mt-1 min-w-44 rounded-md border border-cardBorder bg-cardBackground p-1 shadow-lg"
              >
                {INDICATORS.map((ind) => (
                  <button
                    key={ind.key}
                    role="menuitemcheckbox"
                    aria-checked={shownIndicators.has(ind.key)}
                    onClick={() => toggleIndicator(ind.key)}
                    className={menuItemClass}
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${shownIndicators.has(ind.key) ? "" : "invisible"}`}
                      aria-hidden
                    />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: ind.color }}
                      aria-hidden
                    />
                    {ind.key}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu((m) => (m === "draw" ? null : "draw"))}
              aria-expanded={openMenu === "draw"}
              aria-haspopup="menu"
              className={menuButtonClass(openMenu === "draw" || !!activeTool)}
            >
              {activeToolLabel ?? "Tegn"}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </button>
            {openMenu === "draw" && (
              <div
                role="menu"
                aria-label="Tegneverktøy"
                className="absolute right-0 top-full z-20 mt-1 min-w-44 rounded-md border border-cardBorder bg-cardBackground p-1 shadow-lg"
              >
                {TOOLS.map((t) => (
                  <button
                    key={t.key}
                    role="menuitemradio"
                    aria-checked={activeTool === t.key}
                    onClick={() => {
                      setActiveTool((cur) => (cur === t.key ? null : t.key));
                      setOpenMenu(null);
                    }}
                    className={menuItemClass}
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${activeTool === t.key ? "" : "invisible"}`}
                      aria-hidden
                    />
                    {t.label}
                  </button>
                ))}
                {drawings.length > 0 && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setDrawings([]);
                      setOpenMenu(null);
                    }}
                    className={menuItemClass}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    Fjern tegninger
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Lukk fullskjerm" : "Vis fullskjerm"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-cardBorder text-foreground-secondary transition-colors hover:border-foreground-secondary hover:text-foreground-primary"
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{ cursor: activeTool ? "crosshair" : undefined }}
        className={fullscreen ? "min-h-0 w-full flex-1" : "h-80 w-full"}
      />
      {activeTool && (
        <p className="text-xs text-foreground-secondary mt-2" role="status">
          {activeTool === "hline"
            ? "Klikk i grafen for å plassere linjen."
            : "Klikk to punkter i grafen."}{" "}
          Esc avbryter.
        </p>
      )}
      {isLoading && (
        <p className="text-sm text-foreground-secondary mt-2">
          Laster kursdata fra Nordnet...
        </p>
      )}

      {legend.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {legend.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 text-xs text-foreground-secondary"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
