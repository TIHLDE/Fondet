"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import SoknaderTable from "@/components/SoknaderTable";

interface Document {
  title: string;
  url: string;
  type: string;
}

function DocRow({ doc }: { doc: Document }) {
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 py-3 px-2 -mx-2 rounded hover:bg-cardBorder/20 transition-colors"
    >
      <span className="flex-1 min-w-0 truncate text-foreground-primary text-sm font-medium">
        {doc.title}
      </span>
      <ExternalLink
        className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground-primary transition-colors"
        aria-hidden
      />
    </a>
  );
}

export default function RapporterPublicPage() {
  const [reports, setReports] = useState<Document[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports ?? []);
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

  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-12 px-4 sm:px-0 pt-8 sm:pt-0">
          <h1 className="text-4xl font-bold text-foreground-primary mb-2">
            Rapporter og dokumenter
          </h1>
          <p className="text-foreground-secondary">
            Årsrapporter, strategi, søknader og vedtak
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
          {reports.length > 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {Object.entries(groupedReports).map(([type, items]) => (
                  <div key={type}>
                    <h2 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-1">
                      {type}
                    </h2>
                    <div className="divide-y divide-cardBorder">
                      {items.map((r, i) => (
                        <DocRow key={i} doc={r} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground-primary mb-6">
              Søknader og vedtak
            </h2>
            <SoknaderTable />
          </div>

          {reports.length === 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg text-center">
              <p className="text-foreground-secondary">
                Ingen rapporter tilgjengelig ennå.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
