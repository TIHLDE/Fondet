"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member, MembersFile } from "@/data/members";
import { api, jsonInit, errorMessage } from "./api";

type FormState = {
  name: string;
  role: string;
  studie: string;
  startYear: string;
  endYear: string;
  linkedin: string;
};

const EMPTY: FormState = {
  name: "",
  role: "",
  studie: "",
  startYear: "",
  endYear: "",
  linkedin: "",
};

function toForm(m: Member): FormState {
  return {
    name: m.name,
    role: m.role,
    studie: m.studie,
    startYear: String(m.startYear),
    endYear: m.endYear ? String(m.endYear) : "",
    linkedin: m.linkedin ?? "",
  };
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-foreground-primary mb-1"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function MemberForm({
  idPrefix,
  form,
  setForm,
}: {
  idPrefix: string;
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  const set = (key: keyof FormState) => (v: string) =>
    setForm({ ...form, [key]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field id={`${idPrefix}-name`} label="Navn" value={form.name} onChange={set("name")} />
      <Field id={`${idPrefix}-role`} label="Rolle" value={form.role} onChange={set("role")} />
      <Field id={`${idPrefix}-studie`} label="Studie" value={form.studie} onChange={set("studie")} />
      <Field id={`${idPrefix}-linkedin`} label="LinkedIn-lenke" value={form.linkedin} onChange={set("linkedin")} />
      <Field id={`${idPrefix}-start`} label="Startår" type="number" value={form.startYear} onChange={set("startYear")} />
      <Field id={`${idPrefix}-end`} label="Sluttår (tomt for aktive)" type="number" value={form.endYear} onChange={set("endYear")} />
    </div>
  );
}

export default function MembersAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-members"],
    queryFn: () => api<MembersFile>("/api/admin/members"),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const members = data
    ? [...data.allMembers, ...data.previousMembers].sort((a, b) => {
        if (!a.endYear !== !b.endYear) return a.endYear ? 1 : -1;
        if (a.endYear && b.endYear) return b.endYear - a.endYear;
        return a.startYear - b.startYear;
      })
    : [];

  async function run(action: () => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await action();
      await qc.invalidateQueries({ queryKey: ["admin-members"] });
      toast.success(done);
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  function body(patch: boolean) {
    return {
      name: form.name,
      role: form.role,
      studie: form.studie,
      linkedin: form.linkedin,
      startYear: form.startYear ? Number(form.startYear) : undefined,
      endYear: form.endYear ? Number(form.endYear) : patch ? null : undefined,
    };
  }

  async function create() {
    if (await run(() => api("/api/admin/members", jsonInit("POST", body(false))), "Medlem lagt til")) {
      setShowNew(false);
      setForm(EMPTY);
    }
  }

  async function save(id: string) {
    if (await run(() => api(`/api/admin/members/${id}`, jsonInit("PATCH", body(true))), "Medlem oppdatert")) {
      setEditingId(null);
    }
  }

  async function remove(m: Member) {
    if (!confirm(`Slette ${m.name}? Dette kan ikke angres.`)) return;
    await run(() => api(`/api/admin/members/${m.id}`, { method: "DELETE" }), "Medlem slettet");
  }

  async function uploadPortrait(m: Member, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    await run(
      () => api(`/api/admin/members/${m.id}/portrait`, { method: "POST", body: fd }),
      `Portrett lastet opp for ${m.name}`,
    );
  }

  async function removePortrait(m: Member) {
    if (!confirm(`Fjerne portrettet til ${m.name}?`)) return;
    await run(
      () => api(`/api/admin/members/${m.id}/portrait`, { method: "DELETE" }),
      "Portrett fjernet",
    );
  }

  return (
    <section aria-labelledby="admin-members-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="admin-members-heading" className="text-2xl font-bold text-foreground-primary">
          Medlemmer
        </h2>
        <Button
          type="button"
          onClick={() => {
            setShowNew(!showNew);
            setEditingId(null);
            setForm(EMPTY);
          }}
        >
          {showNew ? "Avbryt" : "Nytt medlem"}
        </Button>
      </div>

      {showNew && (
        <div className="bg-cardBackground border border-cardBorder rounded-lg p-4 mb-6">
          <MemberForm idPrefix="new-member" form={form} setForm={setForm} />
          <Button type="button" onClick={create} disabled={busy} className="mt-4">
            Lagre nytt medlem
          </Button>
        </div>
      )}

      {isLoading && <p className="text-foreground-secondary">Laster medlemmer ...</p>}
      {isError && (
        <p role="alert" className="text-red-500">
          Kunne ikke laste medlemmene. Prøv igjen senere.
        </p>
      )}

      <ul className="space-y-3">
        {members.map((m) => (
          <li key={m.id} className="bg-cardBackground border border-cardBorder rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground-primary">
                  {m.name}
                  {m.endYear ? (
                    <span className="font-normal text-foreground-secondary"> (tidligere)</span>
                  ) : null}
                </p>
                <p className="text-sm text-foreground-secondary">
                  {m.role} - {m.studie} - {m.startYear}
                  {m.endYear ? ` til ${m.endYear}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (editingId === m.id) {
                      setEditingId(null);
                    } else {
                      setEditingId(m.id);
                      setShowNew(false);
                      setForm(toForm(m));
                    }
                  }}
                >
                  {editingId === m.id ? "Avbryt" : "Rediger"}
                </Button>
                <Button type="button" variant="destructive" className="min-h-[44px] px-4" onClick={() => remove(m)} disabled={busy}>
                  Slett
                </Button>
              </div>
            </div>

            {editingId === m.id && (
              <div className="mt-4 border-t border-cardBorder pt-4">
                <MemberForm idPrefix={`edit-${m.id}`} form={form} setForm={setForm} />
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <Button type="button" onClick={() => save(m.id)} disabled={busy}>
                    Lagre endringer
                  </Button>
                  <div>
                    <label
                      htmlFor={`portrait-${m.id}`}
                      className="block text-sm font-semibold text-foreground-primary mb-1"
                    >
                      Last opp portrett (jpg, png eller webp)
                    </label>
                    <input
                      id={`portrait-${m.id}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="text-sm text-foreground-secondary"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPortrait(m, file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => removePortrait(m)} disabled={busy}>
                    Fjern portrett
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
