"use client";

import { useEffect, useState } from "react";

interface Report {
  title: string;
  url: string;
  type: string;
}

export default function RapporterPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [newReport, setNewReport] = useState<Report>({ title: "", url: "", type: "Kvartalsrapport" });
  const [savingReports, setSavingReports] = useState(false);
  const [editingReport, setEditingReport] = useState<number | null>(null);
  const [editReportValues, setEditReportValues] = useState<Report>({ title: "", url: "", type: "" });

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []));
  }, []);

  async function saveReports(updated: Report[]) {
    setSavingReports(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reports: updated }),
    });
    setReports(updated);
    setSavingReports(false);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        Kvartalsrapporter og lenker
      </h2>
      <div className="space-y-3">
        {reports.map((r, i) => (
          <div key={i} className="bg-gray-900 p-3 rounded">
            {editingReport === i ? (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editReportValues.title}
                    onChange={(e) =>
                      setEditReportValues((v) => ({ ...v, title: e.target.value }))
                    }
                    placeholder="Tittel"
                    className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={editReportValues.type}
                    onChange={(e) =>
                      setEditReportValues((v) => ({ ...v, type: e.target.value }))
                    }
                    className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Kvartalsrapport">Kvartalsrapport</option>
                    <option value="Årsrapport">Årsrapport</option>
                    <option value="Annet">Annet</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editReportValues.url}
                    onChange={(e) =>
                      setEditReportValues((v) => ({ ...v, url: e.target.value }))
                    }
                    placeholder="URL"
                    className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const updated = [...reports];
                      updated[i] = editReportValues;
                      saveReports(updated);
                      setEditingReport(null);
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    Lagre
                  </button>
                  <button
                    onClick={() => setEditingReport(null)}
                    className="px-3 py-2 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                  {r.type || "Annet"}
                </span>
                <span className="text-white flex-1">{r.title}</span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm truncate max-w-[300px]"
                >
                  {r.url}
                </a>
                <button
                  onClick={() => {
                    setEditingReport(i);
                    setEditReportValues({ ...r, type: r.type || "Annet" });
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Rediger
                </button>
                <button
                  onClick={() => {
                    const updated = reports.filter((_, j) => j !== i);
                    saveReports(updated);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Slett
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-4">
        <input
          type="text"
          placeholder="Tittel (f.eks. Q1 2025 Rapport)"
          value={newReport.title}
          onChange={(e) => setNewReport((r) => ({ ...r, title: e.target.value }))}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <select
          value={newReport.type}
          onChange={(e) => setNewReport((r) => ({ ...r, type: e.target.value }))}
          className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="Kvartalsrapport">Kvartalsrapport</option>
          <option value="Årsrapport">Årsrapport</option>
          <option value="Annet">Annet</option>
        </select>
        <input
          type="text"
          placeholder="URL"
          value={newReport.url}
          onChange={(e) => setNewReport((r) => ({ ...r, url: e.target.value }))}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          disabled={savingReports || !newReport.title || !newReport.url}
          onClick={() => {
            const updated = [...reports, newReport];
            saveReports(updated);
            setNewReport({ title: "", url: "", type: "Kvartalsrapport" });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm disabled:opacity-50"
        >
          Legg til
        </button>
      </div>
    </div>
  );
}
