"use client";

import { useEffect, useState } from "react";

interface Application {
  title: string;
  url: string;
  type: string;
}

export default function SoknaderPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApp, setNewApp] = useState<Application>({ title: "", url: "", type: "Søknad" });
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Application>({ title: "", url: "", type: "" });

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setApplications(d.applications ?? []));
  }, []);

  async function saveApplications(updated: Application[]) {
    setSaving(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applications: updated }),
    });
    setApplications(updated);
    setSaving(false);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        Søknader og vedtak
      </h2>
      <div className="space-y-3">
        {applications.map((a, i) => (
          <div key={i} className="bg-gray-900 p-3 rounded">
            {editingIndex === i ? (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editValues.title}
                    onChange={(e) =>
                      setEditValues((v) => ({ ...v, title: e.target.value }))
                    }
                    placeholder="Tittel"
                    className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={editValues.type}
                    onChange={(e) =>
                      setEditValues((v) => ({ ...v, type: e.target.value }))
                    }
                    className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Søknad">Søknad</option>
                    <option value="Vedtak">Vedtak</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editValues.url}
                    onChange={(e) =>
                      setEditValues((v) => ({ ...v, url: e.target.value }))
                    }
                    placeholder="URL"
                    className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const updated = [...applications];
                      updated[i] = editValues;
                      saveApplications(updated);
                      setEditingIndex(null);
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    Lagre
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="px-3 py-2 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                  {a.type}
                </span>
                <span className="text-white flex-1">{a.title}</span>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm truncate max-w-[300px]"
                >
                  {a.url}
                </a>
                <button
                  onClick={() => {
                    setEditingIndex(i);
                    setEditValues({ ...a });
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Rediger
                </button>
                <button
                  onClick={() => {
                    const updated = applications.filter((_, j) => j !== i);
                    saveApplications(updated);
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
          placeholder="Tittel (f.eks. Søknad – Gruppe: Beskrivelse)"
          value={newApp.title}
          onChange={(e) => setNewApp((a) => ({ ...a, title: e.target.value }))}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <select
          value={newApp.type}
          onChange={(e) => setNewApp((a) => ({ ...a, type: e.target.value }))}
          className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="Søknad">Søknad</option>
          <option value="Vedtak">Vedtak</option>
        </select>
        <input
          type="text"
          placeholder="URL"
          value={newApp.url}
          onChange={(e) => setNewApp((a) => ({ ...a, url: e.target.value }))}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          disabled={saving || !newApp.title || !newApp.url}
          onClick={() => {
            const updated = [...applications, newApp];
            saveApplications(updated);
            setNewApp({ title: "", url: "", type: "Søknad" });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm disabled:opacity-50"
        >
          Legg til
        </button>
      </div>
    </div>
  );
}
