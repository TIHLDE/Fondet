"use client";

import { useEffect, useState } from "react";

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

export default function MedlemmerPage() {
  const [data, setData] = useState<MemberData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Member>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingGroupImage, setUploadingGroupImage] = useState(false);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then(setData);
  }, []);

  function startEdit(member: Member) {
    setEditingId(member.id);
    setEditValues({ ...member });
    setImagePreview(member.image || null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({});
    setImagePreview(null);
  }

  async function handleGroupImageUpload(file: File) {
    setUploadingGroupImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", "group");
    const res = await fetch("/api/members/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      await fetch("/api/members/group-image", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupImage: url }),
      });
      const refreshed = await fetch("/api/members").then((r) => r.json());
      setData(refreshed);
    }
    setUploadingGroupImage(false);
  }

  async function handleImageUpload(file: File) {
    if (!editValues.id) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", editValues.id);
    const res = await fetch("/api/members/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setEditValues((v) => ({ ...v, image: url }));
      setImagePreview(url);
    }
    setUploading(false);
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

  function renderTable(members: Member[], title: string) {
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
                <th className="px-3 py-2">Bilde</th>
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
                              setEditValues((v) => ({ ...v, name: e.target.value }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                            value={editValues.role ?? ""}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, role: e.target.value }))
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
                              setEditValues((v) => ({ ...v, studie: e.target.value }))
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
                              setEditValues((v) => ({ ...v, startYear: Number(e.target.value) }))
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
                                  setEditValues((v) => ({ ...v, endYear: Number(e.target.value) }))
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
                                setEditValues((v) => ({ ...v, endYear: new Date().getFullYear() }))
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
                              setEditValues((v) => ({ ...v, linkedin: e.target.value }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <input
                              type="file"
                              accept="image/*"
                              className="bg-gray-800 text-white px-2 py-1 rounded w-full text-xs"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                              }}
                            />
                            {uploading && <span className="text-yellow-400 text-xs">Laster opp...</span>}
                            {imagePreview && (
                              <img src={imagePreview} alt="Forhåndsvisning" className="w-12 h-12 object-cover rounded" />
                            )}
                          </div>
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
                        <td className="px-3 py-2">
                          {m.image ? <img src={m.image} alt={m.name} className="w-10 h-10 object-cover rounded" /> : "-"}
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
    return <div className="text-white">Laster...</div>;
  }

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Gruppebilde</h2>
        <div className="flex items-center gap-4">
          {data.groupImage && (
            <img src={data.groupImage} alt="Gruppebilde" className="w-32 h-20 object-cover rounded" />
          )}
          <div className="flex flex-col gap-1">
            <input
              type="file"
              accept="image/*"
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleGroupImageUpload(file);
              }}
            />
            {uploadingGroupImage && <span className="text-yellow-400 text-xs">Laster opp...</span>}
          </div>
        </div>
      </div>
      {renderTable(data.allMembers, "Nåværende medlemmer")}
      {renderTable(data.previousMembers, "Tidligere medlemmer")}
    </div>
  );
}
