"use client";

import { useEffect, useState } from "react";

interface Report {
  title: string;
  url: string;
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []));
  }, []);

  if (reports.length === 0) return null;

  return (
    <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-foreground-primary mb-4">
        Rapporter og dokumenter
      </h2>
      <div className="space-y-3">
        {reports.map((r, i) => (
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
  );
}
