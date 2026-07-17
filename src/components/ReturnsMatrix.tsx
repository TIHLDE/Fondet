"use client";

import { useNordnet } from "./NordnetProfileCard";
import type { Holding } from "@/lib/nordnet-types";

const PERIODS: { key: keyof Holding; label: string }[] = [
  { key: "performanceOneMonth", label: "1 md" },
  { key: "performanceThisYear", label: "I år" },
  { key: "performanceThreeYears", label: "3 år" },
  { key: "performanceFiveYears", label: "5 år" },
];

function fmt(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1).replace(".", ",")} %`;
}

// Subtle heatmap tint. Text always stays the primary color for contrast; the
// background only hints at magnitude, capped so it never overpowers the text.
function tint(v: number): string {
  const alpha = Math.min(Math.abs(v) / 20, 1) * 0.3;
  const rgb = v >= 0 ? "16, 163, 74" : "220, 38, 38";
  return `rgba(${rgb}, ${alpha})`;
}

export default function ReturnsMatrix() {
  const { data, isLoading } = useNordnet();

  if (isLoading) {
    return (
      <div className="h-64 rounded-lg bg-cardBackground border border-cardBorder animate-pulse" />
    );
  }

  const holdings = data?.holdings ?? [];
  if (holdings.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-1">
        Avkastning per periode
      </h2>
      <p className="text-sm text-foreground-secondary mb-5">
        Fondenes egne tall fra Nordnet. Farge viser styrke, grønn opp og rød
        ned.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Avkastning per fond over 1 måned, i år, 3 år og 5 år
          </caption>
          <thead>
            <tr className="border-b border-cardBorder">
              <th
                scope="col"
                className="py-2 pr-4 text-left font-medium text-foreground-secondary"
              >
                Fond
              </th>
              {PERIODS.map((p) => (
                <th
                  key={p.label}
                  scope="col"
                  className="py-2 px-3 text-right font-medium text-foreground-secondary tabular-nums"
                >
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.legacyInstrumentId} className="border-b border-cardBorder/50">
                <th
                  scope="row"
                  className="py-2 pr-4 text-left font-normal text-foreground-primary max-w-[16rem] truncate"
                >
                  {h.name}
                </th>
                {PERIODS.map((p) => {
                  const v = h[p.key] as number | null;
                  return (
                    <td
                      key={p.label}
                      className="py-2 px-3 text-right tabular-nums text-foreground-primary"
                      style={v !== null ? { background: tint(v) } : undefined}
                    >
                      {v !== null ? (
                        fmt(v)
                      ) : (
                        <span className="text-foreground-secondary">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
