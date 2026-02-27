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
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div className="absolute left-0 right-0 top-0 bottom-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(90deg, rgba(30,64,175,0.2) 0%, rgba(59,130,246,0.3) 50%, rgba(96,165,250,0.2) 100%)'
          }}
        />
      </div>

      <main className="flex flex-col items-center justify-center relative z-10">
        {/* Title section with wave */}
        <div style={{ marginBottom: '32px', width: '100%' }}>
          <div style={{ paddingTop: '64px', paddingBottom: '16px', background: '#000000', overflowWrap: 'break-word' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <h1 className="text-4xl font-bold text-white" style={{ marginLeft: '20px' }}>Rapporter og dokumenter</h1>
            </div>
          </div>
          <svg viewBox="0 1.4 20 1.2" width="100%" height="80" preserveAspectRatio="none">
            <path fill="#000000" d="M 0 2 C 10 4 10 0 20 2 L 20 0 L 0 0 Z"></path>
          </svg>
        </div>

        <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-8">
          {/* Rapporter */}
          {reports.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Rapporter
              </h2>
              {Object.entries(groupedReports).map(([type, items]) => (
                <div key={type} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {type}
                  </h3>
                  <div className="space-y-2">
                    {items.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded border border-white/10 hover:bg-white/5 transition"
                      >
                        <span className="text-white font-medium">
                          {r.title}
                        </span>
                        <span className="text-gray-400 text-sm">
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
            <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Søknader og vedtak
              </h2>
              {Object.entries(groupedApplications).map(([type, items]) => (
                <div key={type} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {type}
                  </h3>
                  <div className="space-y-2">
                    {items.map((a, i) => (
                      <a
                        key={i}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded border border-white/10 hover:bg-white/5 transition"
                      >
                        <span className="text-white font-medium">
                          {a.title}
                        </span>
                        <span className="text-gray-400 text-sm">
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
            <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg text-center">
              <p className="text-gray-400">Ingen dokumenter tilgjengelig ennå.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
