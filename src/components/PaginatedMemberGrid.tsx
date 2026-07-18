"use client";

import { useMemo, useState } from "react";
import MemberCard from "./MemberCard";
import type { Member } from "@/data/members";

const PAGE_SIZE = 12;

function term(m: Member): string {
  return `${m.startYear}-${m.endYear ?? ""}`;
}

export default function PaginatedMemberGrid({
  members,
  filterable = false,
}: {
  members: Member[];
  filterable?: boolean;
}) {
  const [page, setPage] = useState(0);
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");

  const roles = useMemo(
    () => Array.from(new Set(members.map((m) => m.role))).sort(),
    [members],
  );
  const periods = useMemo(
    () =>
      Array.from(new Set(members.map(term))).sort((a, b) =>
        b.localeCompare(a),
      ),
    [members],
  );

  const filtered = useMemo(
    () =>
      members.filter(
        (m) => (!role || m.role === role) && (!period || term(m) === period),
      ),
    [members, role, period],
  );

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const current = Math.min(page, Math.max(0, pageCount - 1));
  const visible = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const selectClass =
    "h-11 px-3 rounded-md border border-cardBorder bg-cardBackground text-foreground-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div>
      {filterable && (
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm text-foreground-secondary">
            Rolle
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(0);
              }}
              className={selectClass}
            >
              <option value="">Alle roller</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground-secondary">
            Periode
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setPage(0);
              }}
              className={selectClass}
            >
              <option value="">Alle perioder</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="text-foreground-secondary text-sm">
          Ingen medlemmer samsvarer med filteret.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {visible.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      )}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Forrige
          </button>
          <span className="text-sm text-foreground-secondary">
            Side {current + 1} av {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={current >= pageCount - 1}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Neste
          </button>
        </div>
      )}
    </div>
  );
}
