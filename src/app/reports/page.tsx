"use client";

import { useEffect, useState } from "react";

interface Document {
  title: string;
  url: string;
  type: string;
}

export default function RapporterPublicPage() {
  const [reports, setReports] = useState<Document[]>([]);
  const [applications, setApplications] = useState<Document[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports ?? []);
        setApplications(d.applications ?? []);
      });
  }, []);

  function groupByType(items: Document[]) {
    const grouped: Record<string, Document[]> = {};
    for (const item of items) {
      const type = item.type || "Annet";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(item);
    }
    return grouped;
  }

  const groupedReports = groupByType(reports);
  const groupedApplications = groupByType(applications);

  return (
    <div className="min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-12 px-4 sm:px-0 pt-8 sm:pt-0">
          <h1 className="text-4xl font-bold text-foreground">Rapporter og dokumenter</h1>
        </div>

        <div className="w-full max-w-6xl mx-auto space-y-6 px-0 sm:px-0">
          {/* Rapporter */}
          {reports.length > 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-foreground-primary mb-4">
                Rapporter
              </h2>
              {Object.entries(groupedReports).map(([type, items]) => (
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
          )}

          {/* Søknader og vedtak */}
          {applications.length > 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-foreground-primary mb-4">
                Søknader og vedtak
              </h2>
              {Object.entries(groupedApplications).map(([type, items]) => (
                <div key={type} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-2">
                    {type}
                  </h3>
                  <div className="space-y-2">
                    {items.map((a, i) => (
                      <a
                        key={i}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded border border-cardBorder hover:bg-cardBorder/20 transition"
                      >
                        <span className="text-foreground-primary font-medium">
                          {a.title}
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
          )}

          {reports.length === 0 && applications.length === 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg text-center">
              <p className="text-foreground-secondary">Ingen dokumenter tilgjengelig ennå.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
