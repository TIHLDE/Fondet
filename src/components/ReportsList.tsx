"use client";

import { useEffect, useState } from "react";

interface Report {
  title: string;
  url: string;
  type: string;
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []));
  }, []);

  if (reports.length === 0) return null;

  const grouped: Record<string, Report[]> = {};
  for (const r of reports) {
    const type = r.type || "Annet";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(r);
  }

  return (
    <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-4">
        Rapporter og dokumenter
      </h2>
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-4 last:mb-0">
          <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-2">
            {type}
          </h3>
          <div className="space-y-2">
            {items.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded border border-cardBorder hover:bg-cardBorder/20 transition"
              >
                <span className="text-foreground-primary font-medium">
                  {r.title}
                </span>
                <span className="text-foreground-secondary text-sm">
                  Åpne &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
