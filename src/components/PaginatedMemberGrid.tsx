"use client";

import { useState } from "react";
import MemberCard from "./MemberCard";
import type { Member } from "@/data/members";

const PAGE_SIZE = 12;

export default function PaginatedMemberGrid({
  members,
}: {
  members: Member[];
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(members.length / PAGE_SIZE);
  const visible = members.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {visible.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Forrige
          </button>
          <span className="text-sm text-foreground-secondary">
            Side {page + 1} av {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Neste
          </button>
        </div>
      )}
    </div>
  );
}
