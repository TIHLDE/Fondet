"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Soknad } from "@/data/soknader";
import { api, jsonInit, errorMessage } from "./api";

type FormState = {
  hvem: string;
  hva: string;
  dato: string;
  soktLabel: string;
  soktUrl: string;
  resultatLabel: string;
  resultatUrl: string;
  innvilget: boolean;
};

const EMPTY: FormState = {
  hvem: "",
  hva: "",
  dato: "",
  soktLabel: "",
  soktUrl: "",
  resultatLabel: "",
  resultatUrl: "",
  innvilget: true,
};

function toForm(s: Soknad): FormState {
  return {
    hvem: s.hvem,
    hva: s.hva,
    dato: s.dato,
    soktLabel: s.sokt.label,
    soktUrl: s.sokt.url,
    resultatLabel: s.resultat.label,
    resultatUrl: s.resultat.url,
    innvilget: s.resultat.innvilget,
  };
}

function toBody(f: FormState): Soknad {
  return {
    hvem: f.hvem,
    hva: f.hva,
    dato: f.dato,
    sokt: { label: f.soktLabel, url: f.soktUrl },
    resultat: { label: f.resultatLabel, url: f.resultatUrl, innvilget: f.innvilget },
  };
}

function SoknadForm({
  idPrefix,
  form,
  setForm,
}: {
  idPrefix: string;
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  const text = (key: keyof FormState, label: string, placeholder = "") => (
    <div>
      <label htmlFor={`${idPrefix}-${key}`} className="block text-sm font-semibold text-foreground-primary mb-1">
        {label}
      </label>
      <Input
        id={`${idPrefix}-${key}`}
        value={String(form[key])}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {text("hvem", "Hvem")}
      {text("hva", "Hva")}
      {text("dato", "Dato", "DD.MM.ÅÅÅÅ")}
      {text("soktLabel", "Søkt beløp")}
      {text("soktUrl", "Lenke til søknad", "https://...")}
      {text("resultatLabel", "Resultat")}
      {text("resultatUrl", "Lenke til vedtak", "https://...")}
      <div className="flex items-end pb-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground-primary min-h-[44px]">
          <input
            type="checkbox"
            checked={form.innvilget}
            onChange={(e) => setForm({ ...form, innvilget: e.target.checked })}
            className="h-5 w-5"
          />
          Innvilget
        </label>
      </div>
    </div>
  );
}

export default function SoknaderAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["soknader"],
    queryFn: () => api<Soknad[]>("/api/soknader"),
  });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const rows = data ?? [];

  async function run(action: () => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await action();
      await qc.invalidateQueries({ queryKey: ["soknader"] });
      toast.success(done);
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    if (await run(() => api("/api/admin/soknader", jsonInit("POST", toBody(form))), "Søknad lagt til")) {
      setShowNew(false);
      setForm(EMPTY);
    }
  }

  async function save(index: number) {
    if (await run(() => api(`/api/admin/soknader/${index}`, jsonInit("PATCH", toBody(form))), "Søknad oppdatert")) {
      setEditing(null);
    }
  }

  async function remove(index: number, row: Soknad) {
    if (!confirm(`Slette søknaden fra ${row.hvem} (${row.dato})? Dette kan ikke angres.`)) return;
    await run(() => api(`/api/admin/soknader/${index}`, { method: "DELETE" }), "Søknad slettet");
  }

  return (
    <section aria-labelledby="admin-soknader-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 id="admin-soknader-heading" className="text-2xl font-bold text-foreground-primary">
          Søknader og vedtak
        </h2>
        <Button
          type="button"
          onClick={() => {
            setShowNew(!showNew);
            setEditing(null);
            setForm(EMPTY);
          }}
        >
          {showNew ? "Avbryt" : "Ny søknad"}
        </Button>
      </div>

      {showNew && (
        <div className="bg-cardBackground border border-cardBorder rounded-lg p-4 mb-6">
          <SoknadForm idPrefix="new-soknad" form={form} setForm={setForm} />
          <Button type="button" onClick={create} disabled={busy} className="mt-4">
            Lagre ny søknad
          </Button>
        </div>
      )}

      {isLoading && <p className="text-foreground-secondary">Laster søknader ...</p>}
      {isError && (
        <p role="alert" className="text-red-500">
          Kunne ikke laste søknadene. Prøv igjen senere.
        </p>
      )}

      <ul className="space-y-3">
        {rows.map((s, i) => (
          <li key={`${s.dato}-${s.hvem}-${i}`} className="bg-cardBackground border border-cardBorder rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground-primary">
                  {s.hvem} - {s.hva}
                </p>
                <p className="text-sm text-foreground-secondary">
                  {s.dato} - søkt {s.sokt.label} -{" "}
                  {s.resultat.innvilget ? "innvilget" : "avslått"} {s.resultat.label}
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
                      setForm(toForm(s));
                    }
                  }}
                >
                  {editing === i ? "Avbryt" : "Rediger"}
                </Button>
                <Button type="button" variant="destructive" className="min-h-[44px] px-4" onClick={() => remove(i, s)} disabled={busy}>
                  Slett
                </Button>
              </div>
            </div>
            {editing === i && (
              <div className="mt-4 border-t border-cardBorder pt-4">
                <SoknadForm idPrefix={`edit-soknad-${i}`} form={form} setForm={setForm} />
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
