"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Document {
  title: string;
  url: string;
  type: string;
}

const PAGE_SIZE = 8;

function splitTitle(title: string) {
  const m = title.match(
    /^(?:Søknad|Vedtak)\s+–\s+(.*?)\s*\((\d{2}\.\d{2}\.\d{4})\)\s*$/
  );
  if (!m) return { name: title, date: "" };
  return { name: m[1], date: m[2] };
}

function DocRow({ doc, compact }: { doc: Document; compact?: boolean }) {
  const { name, date } = compact
    ? splitTitle(doc.title)
    : { name: doc.title, date: "" };
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 py-3 px-2 -mx-2 rounded hover:bg-cardBorder/20 transition-colors"
    >
      <span className="flex-1 min-w-0 truncate text-foreground-primary text-sm font-medium">
        {name}
      </span>
      {date && (
        <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
          {date}
        </span>
      )}
      <ExternalLink
        className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground-primary transition-colors"
        aria-hidden
      />
    </a>
  );
}

function PaginatedDocs({ label, items }: { label: string; items: Document[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const visible = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide mb-1">
        {label}
      </h3>
      <div className="divide-y divide-cardBorder">
        {visible.map((doc, i) => (
          <DocRow key={`${page}-${i}`} doc={doc} compact />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Forrige
          </button>
          <span className="text-sm text-foreground-secondary">
            Side {page + 1} av {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Neste
          </button>
        </div>
      )}
    </div>
  );
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

          {applications.length > 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-foreground-primary mb-6">
                Søknader og vedtak
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
                {Object.entries(groupedApplications).map(([type, items]) => (
                  <PaginatedDocs
                    key={type}
                    label={type === "Søknad" ? "Søknader" : type}
                    items={items}
                  />
                ))}
              </div>
            </div>
          )}

          {reports.length === 0 && applications.length === 0 && (
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg text-center">
              <p className="text-foreground-secondary">
                Ingen dokumenter tilgjengelig ennå.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
