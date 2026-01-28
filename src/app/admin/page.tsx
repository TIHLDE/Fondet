"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
  startYear: number;
  endYear?: number;
  studie: string;
  linkedin?: string;
}

interface Report {
  title: string;
  url: string;
}

interface MemberData {
  groupImage: string;
  allMembers: Member[];
  previousMembers: Member[];
}

const ROLES = ["Analytiker", "Fondsforvalter", "Eldste"];
const STUDIER = ["DATA", "DIGFOR", "DIGSEC", "DIGTRANS"];
const MIN_YEAR = 2020;
const MAX_YEAR = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

export default function AdminPage() {
  const [data, setData] = useState<MemberData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Member>>({});
  const [saving, setSaving] = useState(false);
  const [groupImage, setGroupImage] = useState("");
  const [savingImage, setSavingImage] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [newReport, setNewReport] = useState<Report>({ title: "", url: "" });
  const [savingReports, setSavingReports] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setGroupImage(d.groupImage ?? "");
      });
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

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function startEdit(member: Member) {
    setEditingId(member.id);
    setEditValues({ ...member });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({});
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch("/api/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member: editValues }),
    });
    if (res.ok) {
      const refreshed = await fetch("/api/members").then((r) => r.json());
      setData(refreshed);
      setEditingId(null);
      setEditValues({});
    }
    setSaving(false);
  }

  function renderTable(members: Member[], listKey: string, title: string) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
              <tr>
                <th className="px-3 py-2">Navn</th>
                <th className="px-3 py-2">Rolle</th>
                <th className="px-3 py-2">Studie</th>
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">Slutt</th>
                <th className="px-3 py-2">LinkedIn</th>
                <th className="px-3 py-2">Bilde URL</th>
                <th className="px-3 py-2">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const isEditing = editingId === m.id;
                return (
                  <tr key={m.id} className="border-b border-gray-700">
                    {isEditing ? (
                      <>
                        <td className="px-3 py-2">
                          <input
                            className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                            value={editValues.name ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                name: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                            value={editValues.role ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                role: e.target.value,
                              }))
                            }
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select
                            className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                            value={editValues.studie ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                studie: e.target.value,
                              }))
                            }
                          >
                            {STUDIER.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select
                            className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                            value={editValues.startYear ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                startYear: Number(e.target.value),
                              }))
                            }
                          >
                            {YEARS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          {editValues.endYear != null ? (
                            <div className="flex items-center gap-1">
                              <select
                                className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                                value={editValues.endYear}
                                onChange={(e) =>
                                  setEditValues((v) => ({
                                    ...v,
                                    endYear: Number(e.target.value),
                                  }))
                                }
                              >
                                {YEARS.filter((y) => y >= (editValues.startYear ?? MIN_YEAR)).map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setEditValues((v) => ({ ...v, endYear: undefined }))}
                                className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 whitespace-nowrap"
                              >
                                Aktiv
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setEditValues((v) => ({
                                  ...v,
                                  endYear: new Date().getFullYear(),
                                }))
                              }
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 whitespace-nowrap"
                            >
                              Sluttet
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                            value={editValues.linkedin ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                linkedin: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                            value={editValues.image ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                image: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => saveEdit()}
                            disabled={saving}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Lagre
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                          >
                            Avbryt
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2">{m.name}</td>
                        <td className="px-3 py-2">{m.role}</td>
                        <td className="px-3 py-2">{m.studie}</td>
                        <td className="px-3 py-2">{m.startYear}</td>
                        <td className="px-3 py-2">{m.endYear ?? "-"}</td>
                        <td className="px-3 py-2">{m.linkedin ?? "-"}</td>
                        <td className="px-3 py-2 max-w-[200px] truncate">
                          {m.image || "-"}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => startEdit(m)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            Rediger
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Laster...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Til forsiden
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logg ut
            </button>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Gruppebilde</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Lim inn bilde-URL..."
                value={groupImage}
                onChange={(e) => setGroupImage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              disabled={savingImage}
              onClick={async () => {
                setSavingImage(true);
                await fetch("/api/members/group-image", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ groupImage }),
                });
                setSavingImage(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
            >
              {savingImage ? "Lagrer..." : "Lagre"}
            </button>
          </div>
          {groupImage && (
            <img
              src={groupImage}
              alt="Gruppebilde forhåndsvisning"
              className="mt-4 max-h-64 rounded border border-gray-700 object-cover"
            />
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Kvartalsrapporter og lenker
          </h2>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-900 p-3 rounded"
              >
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
                    const updated = reports.filter((_, j) => j !== i);
                    saveReports(updated);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Slett
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <input
              type="text"
              placeholder="Tittel (f.eks. Q1 2025 Rapport)"
              value={newReport.title}
              onChange={(e) =>
                setNewReport((r) => ({ ...r, title: e.target.value }))
              }
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="URL"
              value={newReport.url}
              onChange={(e) =>
                setNewReport((r) => ({ ...r, url: e.target.value }))
              }
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button
              disabled={savingReports || !newReport.title || !newReport.url}
              onClick={() => {
                const updated = [...reports, newReport];
                saveReports(updated);
                setNewReport({ title: "", url: "" });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              Legg til
            </button>
          </div>
        </div>

        {renderTable(data.allMembers, "allMembers", "Nåværende medlemmer")}
        {renderTable(
          data.previousMembers,
          "previousMembers",
          "Tidligere medlemmer"
        )}
      </div>
    </div>
  );
}
