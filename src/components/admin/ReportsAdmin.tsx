"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, jsonInit, errorMessage } from "./api";

type ReportEntry = { title: string; url: string; type: string };
type FormState = ReportEntry;

const EMPTY: FormState = { title: "", url: "", type: "" };

function EntryForm({
  idPrefix,
  form,
  setForm,
  types,
}: {
  idPrefix: string;
  form: FormState;
  setForm: (f: FormState) => void;
  types: string[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor={`${idPrefix}-title`} className="block text-sm font-semibold text-foreground-primary mb-1">
          Tittel
        </label>
        <Input
          id={`${idPrefix}-title`}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-type`} className="block text-sm font-semibold text-foreground-primary mb-1">
          Kategori
        </label>
        <Input
          id={`${idPrefix}-type`}
          value={form.type}
          list="report-types"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <datalist id="report-types">
          {types.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-url`} className="block text-sm font-semibold text-foreground-primary mb-1">
          Lenke
        </label>
        <Input
          id={`${idPrefix}-url`}
          value={form.url}
          placeholder="/api/reports/... eller https://..."
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      </div>
    </div>
  );
}

export default function ReportsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-content"],
    queryFn: () => api<{ reports: ReportEntry[] }>("/api/content"),
  });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const reports = data?.reports ?? [];
  const types = Array.from(new Set(reports.map((r) => r.type)));

  async function run(action: () => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await action();
      await qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success(done);
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function uploadPdf(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await api<{ url: string }>("/api/admin/reports/upload", {
        method: "POST",
        body: fd,
      });
      setForm((f) => ({ ...f, url }));
      setShowNew(true);
      setEditing(null);
      toast.success("PDF lastet opp. Lenken er fylt inn i skjemaet.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    if (await run(() => api("/api/admin/reports", jsonInit("POST", form)), "Rad lagt til")) {
      setShowNew(false);
      setForm(EMPTY);
    }
  }

  async function save(index: number) {
    if (await run(() => api(`/api/admin/reports/${index}`, jsonInit("PATCH", form)), "Rad oppdatert")) {
      setEditing(null);
    }
  }

  async function remove(index: number, entry: ReportEntry) {
    if (!confirm(`Slette raden "${entry.title}"? Dette kan ikke angres.`)) return;
    await run(() => api(`/api/admin/reports/${index}`, { method: "DELETE" }), "Rad slettet");
  }

  return (
    <section aria-labelledby="admin-reports-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 id="admin-reports-heading" className="text-2xl font-bold text-foreground-primary">
          Rapporter og dokumenter
        </h2>
        <Button
          type="button"
          onClick={() => {
            setShowNew(!showNew);
            setEditing(null);
            setForm(EMPTY);
          }}
        >
          {showNew ? "Avbryt" : "Ny rad"}
        </Button>
      </div>

      <div className="bg-cardBackground border border-cardBorder rounded-lg p-4 mb-6">
        <label htmlFor="report-pdf" className="block text-sm font-semibold text-foreground-primary mb-1">
          Last opp PDF (maks 10 MB)
        </label>
        <input
          id="report-pdf"
          type="file"
          accept="application/pdf"
          className="text-sm text-foreground-secondary"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadPdf(file);
            e.target.value = "";
          }}
        />
        <p className="text-xs text-foreground-secondary mt-1">
          Opplasting fyller inn lenken i radskjemaet. Raden må lagres etterpå
          for å vises på siden.
        </p>
      </div>

      {showNew && (
        <div className="bg-cardBackground border border-cardBorder rounded-lg p-4 mb-6">
          <EntryForm idPrefix="new-report" form={form} setForm={setForm} types={types} />
          <Button type="button" onClick={create} disabled={busy} className="mt-4">
            Lagre ny rad
          </Button>
        </div>
      )}

      {isLoading && <p className="text-foreground-secondary">Laster rader ...</p>}
      {isError && (
        <p role="alert" className="text-red-500">
          Kunne ikke laste radene. Prøv igjen senere.
        </p>
      )}

      <ul className="space-y-3">
        {reports.map((r, i) => (
          <li key={`${r.title}-${i}`} className="bg-cardBackground border border-cardBorder rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground-primary">{r.title}</p>
                <p className="text-sm text-foreground-secondary break-all">
                  {r.type} - {r.url}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (editing === i) {
                      setEditing(null);
                    } else {
                      setEditing(i);
                      setShowNew(false);
                      setForm({ title: r.title, url: r.url, type: r.type });
                    }
                  }}
                >
                  {editing === i ? "Avbryt" : "Rediger"}
                </Button>
                <Button type="button" variant="destructive" className="min-h-[44px] px-4" onClick={() => remove(i, r)} disabled={busy}>
                  Slett
                </Button>
              </div>
            </div>
            {editing === i && (
              <div className="mt-4 border-t border-cardBorder pt-4">
                <EntryForm idPrefix={`edit-report-${i}`} form={form} setForm={setForm} types={types} />
                <Button type="button" onClick={() => save(i)} disabled={busy} className="mt-4">
                  Lagre endringer
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
