"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, jsonInit, errorMessage } from "./api";

type GroupImage = { file: string; url: string; source: "volume" | "repo" };

export default function GroupImagesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-group-images"],
    queryFn: () => api<{ images: GroupImage[] }>("/api/admin/group-images"),
  });
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin-group-images"] });
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Velg en fil først");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("file", file);
      await api("/api/admin/group-images", { method: "POST", body: fd });
      await refresh();
      toast.success("Gruppebilde lastet opp");
      setName("");
      setFile(null);
      (document.getElementById("group-image-file") as HTMLInputElement | null)?.form?.reset();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(img: GroupImage) {
    if (!confirm(`Slette ${img.file}? Dette kan ikke angres.`)) return;
    setBusy(true);
    try {
      await api("/api/admin/group-images", jsonInit("DELETE", { file: img.file }));
      await refresh();
      toast.success("Bilde slettet");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="admin-group-images-heading">
      <h2 id="admin-group-images-heading" className="text-2xl font-bold text-foreground-primary mb-2">
        Gruppebilder
      </h2>
      <p className="text-foreground-secondary mb-4">
        group og group-2 til group-9 vises i karusellen på gruppesiden.
        group-ÅÅÅÅ-N, for eksempel group-2024-1, havner i arkivet på siden for
        tidligere medlemmer.
      </p>

      <form onSubmit={upload} className="bg-cardBackground border border-cardBorder rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="group-image-name" className="block text-sm font-semibold text-foreground-primary mb-1">
              Navn
            </label>
            <Input
              id="group-image-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="group, group-2 eller group-2024-1"
              required
            />
          </div>
          <div>
            <label htmlFor="group-image-file" className="block text-sm font-semibold text-foreground-primary mb-1">
              Bildefil (jpg, png eller webp)
            </label>
            <input
              id="group-image-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-sm text-foreground-secondary py-2"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={busy} className="mt-4">
          Last opp
        </Button>
      </form>

      {isLoading && <p className="text-foreground-secondary">Laster bilder ...</p>}
      {isError && (
        <p role="alert" className="text-red-500">
          Kunne ikke laste gruppebildene. Prøv igjen senere.
        </p>
      )}

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(data?.images ?? []).map((img) => (
          <li key={img.file} className="bg-cardBackground border border-cardBorder rounded-lg p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={`Gruppebilde ${img.file}`} className="w-full h-32 object-cover rounded" />
            <p className="text-sm text-foreground-primary mt-2 break-all">{img.file}</p>
            <p className="text-xs text-foreground-secondary mb-2">
              {img.source === "volume" ? "Lastet opp" : "Ligger i repoet"}
            </p>
            {img.source === "volume" ? (
              <Button type="button" variant="destructive" className="min-h-[44px] w-full" onClick={() => remove(img)} disabled={busy}>
                Slett
              </Button>
            ) : (
              <p className="text-xs text-foreground-secondary">Kan bare fjernes fra repoet</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
