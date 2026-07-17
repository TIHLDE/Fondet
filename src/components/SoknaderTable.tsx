"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE, type Soknad } from "@/data/soknader";

export default function SoknaderTable() {
  const [page, setPage] = useState(0);
  const { data: soknader = [], isError } = useQuery<Soknad[]>({
    queryKey: ["soknader"],
    queryFn: async () => {
      const res = await fetch("/api/soknader");
      if (!res.ok) throw new Error("soknader fetch failed");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
  const pageCount = Math.ceil(soknader.length / PAGE_SIZE);
  const visible = soknader.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (isError) {
    return (
      <p className="text-foreground-secondary">
        Kunne ikke laste søknadene. Prøv igjen senere.
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-cardBorder">
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-32">
                Hvem søkte
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-48">
                Hva søktes om
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-24">
                Når
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-32">
                Søkt om
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-32">
                Innvilget
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s, i) => (
              <tr
                key={`${page}-${i}`}
                className={
                  i < visible.length - 1 ? "border-b border-cardBorder" : ""
                }
              >
                <td className="py-3 px-4 text-foreground-secondary w-32">
                  {s.hvem}
                </td>
                <td className="py-3 px-4 text-foreground-secondary w-48">
                  {s.hva}
                </td>
                <td className="py-3 px-4 text-foreground-secondary w-24">
                  {s.dato}
                </td>
                <td className="py-3 px-4 w-32">
                  <a
                    href={s.sokt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {s.sokt.label}
                  </a>
                </td>
                <td className="py-3 px-4 w-32">
                  <a
                    href={s.resultat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      s.resultat.innvilget
                        ? "text-green-400 hover:text-green-300"
                        : "text-red-400 hover:text-red-300"
                    }
                  >
                    {s.resultat.label}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4">
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
