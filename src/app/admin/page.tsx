"use client";

import { useEffect, useState } from "react";

export default function AdminOverview() {
  const [groupImage, setGroupImage] = useState("");
  const [savingImage, setSavingImage] = useState(false);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => setGroupImage(d.groupImage ?? ""));
  }, []);

  return (
    <div>
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
    </div>
  );
}
