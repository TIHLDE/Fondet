"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Home,
  FileText,
  Users,
  Send,
  Sun,
  Moon,
  Monitor,
  CornerDownLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

type Command = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  group: string;
  icon: LucideIcon;
  run: () => void;
};

// Order the groups appear in the list. Results stay grouped so navigation and
// theme actions never get shuffled together.
const GROUP_ORDER = ["Sider", "Tema"];

// Subsequence fuzzy match: every query char must appear in order. Consecutive
// hits and hits at the start of a word score higher, so "omf" ranks "Om
// fondet" above a scattered match. Returns the hit positions for highlighting,
// or null when the query does not fit.
function fuzzy(query: string, text: string): { score: number; hits: number[] } | null {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const hits: number[] = [];
  let qi = 0;
  let streak = 0;
  let score = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      hits.push(ti);
      streak += 1;
      score += streak * 2;
      if (ti === 0 || t[ti - 1] === " ") score += 5;
      qi += 1;
    } else {
      streak = 0;
    }
  }
  if (qi < q.length) return null;
  return { score: score - t.length * 0.1, hits };
}

function Highlight({ text, hits }: { text: string; hits: number[] }) {
  if (hits.length === 0) return <>{text}</>;
  const set = new Set(hits);
  return (
    <>
      {text.split("").map((ch, i) =>
        set.has(i) ? (
          <span key={i} className="text-accent font-semibold">
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </>
  );
}

export default function CommandPalette() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [metaKey, setMetaKey] = useState("Ctrl");
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (navigator.platform.toLowerCase().includes("mac")) setMetaKey("⌘");
  }, []);

  const commands: Command[] = useMemo(() => {
    const go = (path: string) => () => {
      setOpen(false);
      router.push(path);
    };
    const theme = (t: "light" | "dark" | "system") => () => {
      setTheme(t);
      setOpen(false);
    };
    return [
      { id: "home", label: "Forsiden", hint: "Oversikt og live tall", keywords: "hjem start portefolje dashboard", group: "Sider", icon: Home, run: go("/") },
      { id: "about", label: "Om fondet", hint: "Hva Fondet er", keywords: "about historie vedtekter", group: "Sider", icon: FileText, run: go("/about") },
      { id: "reports", label: "Rapporter", hint: "Kvartals- og årsrapporter", keywords: "reports kvartal arsrapport dokumenter", group: "Sider", icon: FileText, run: go("/reports") },
      { id: "group", label: "Forvaltningsgruppen", hint: "Medlemmer", keywords: "group gruppe medlemmer team", group: "Sider", icon: Users, run: go("/group") },
      { id: "group-prev", label: "Tidligere medlemmer", hint: "Arkiv", keywords: "tidligere alumni historikk", group: "Sider", icon: Users, run: go("/group/tidligere") },
      { id: "apply", label: "Søk om støtte", hint: "Slik søker du", keywords: "apply soknad stotte penger", group: "Sider", icon: Send, run: go("/apply") },
      { id: "apply-form", label: "Søknadsskjema", hint: "Fyll ut og send", keywords: "skjema form soknad", group: "Sider", icon: Send, run: go("/apply/skjema") },
      { id: "theme-light", label: "Lyst tema", hint: "Bytt utseende", keywords: "theme lys light dag", group: "Tema", icon: Sun, run: theme("light") },
      { id: "theme-dark", label: "Mørkt tema", hint: "Bytt utseende", keywords: "theme mork dark natt", group: "Tema", icon: Moon, run: theme("dark") },
      { id: "theme-system", label: "Systemtema", hint: "Følg operativsystemet", keywords: "theme system auto", group: "Tema", icon: Monitor, run: theme("system") },
    ];
  }, [router, setTheme]);

  // Rank by fuzzy score across label, hint and keywords. Label hits drive the
  // highlight; a match found only in keywords still lists the item, just
  // without highlighting. With no query the list keeps its authored order.
  const results = useMemo(() => {
    const q = query.trim();
    const scored = commands
      .map((c) => {
        if (!q) return { c, score: 0, hits: [] as number[] };
        const inLabel = fuzzy(q, c.label);
        const inHint = fuzzy(q, c.hint);
        const inKw = fuzzy(q, c.keywords);
        const best = [inLabel, inHint, inKw]
          .filter((m): m is { score: number; hits: number[] } => m !== null)
          .sort((a, b) => b.score - a.score)[0];
        if (!best) return null;
        return {
          c,
          score: best.score + (inLabel ? 3 : 0),
          hits: inLabel?.hits ?? [],
        };
      })
      .filter((r): r is { c: Command; score: number; hits: number[] } => r !== null);

    if (q) scored.sort((a, b) => b.score - a.score);
    // Flatten into the fixed group order so the visible order matches the
    // index the arrow keys walk through.
    return GROUP_ORDER.flatMap((g) => scored.filter((r) => r.c.group === g));
  }, [commands, query]);

  // Global shortcut: Cmd/Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input on open, restore focus to the trigger on close.
  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement as HTMLElement;
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      restoreFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted option visible when arrowing through a long list.
  useEffect(() => {
    if (open) {
      document
        .getElementById(`cmd-opt-${active}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [active, open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Åpne hurtigsøk"
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-cardBorder bg-cardBackground px-4 h-11 text-sm text-foreground-secondary shadow-lg transition-colors hover:bg-cardBorder/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-primary"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Søk</span>
        <kbd className="hidden sm:inline rounded border border-cardBorder px-1.5 text-xs tabular-nums">
          {metaKey} K
        </kbd>
      </button>
    );
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.c.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hurtigsøk"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-cardBorder bg-cardBackground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-cardBorder px-4">
          <Search className="h-4 w-4 text-foreground-secondary shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-listbox"
            aria-activedescendant={
              results[active] ? `cmd-opt-${active}` : undefined
            }
            aria-autocomplete="list"
            placeholder="Søk sider og handlinger…"
            className="w-full bg-transparent py-3.5 text-foreground-primary placeholder:text-foreground-secondary focus:outline-none"
          />
        </div>

        <ul id="cmd-listbox" role="listbox" className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-foreground-secondary">
              Ingen treff for «{query.trim()}»
            </li>
          )}
          {GROUP_ORDER.map((group) => {
            const inGroup = results.filter((r) => r.c.group === group);
            if (inGroup.length === 0) return null;
            return (
              <li key={group} role="presentation">
                <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
                  {group}
                </div>
                <ul role="presentation">
                  {inGroup.map((r) => {
                    flatIndex += 1;
                    const i = flatIndex;
                    const Icon = r.c.icon;
                    const selected = i === active;
                    return (
                      <li
                        key={r.c.id}
                        id={`cmd-opt-${i}`}
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActive(i)}
                        onClick={r.c.run}
                        className={`mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                          selected ? "bg-cardBorder/50" : ""
                        }`}
                      >
                        <Icon className="h-4 w-4 text-accent shrink-0" aria-hidden />
                        <span className="flex-1 min-w-0">
                          <span className="block truncate text-sm text-foreground-primary">
                            <Highlight text={r.c.label} hits={r.hits} />
                          </span>
                          <span className="block truncate text-xs text-foreground-secondary">
                            {r.c.hint}
                          </span>
                        </span>
                        {selected && (
                          <ArrowRight
                            className="h-4 w-4 text-foreground-secondary shrink-0"
                            aria-hidden
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-cardBorder px-4 py-2 text-xs text-foreground-secondary">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-cardBorder px-1">↑</kbd>
            <kbd className="rounded border border-cardBorder px-1">↓</kbd>
            naviger
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-cardBorder px-1">
              <CornerDownLeft className="h-3 w-3" aria-hidden />
            </kbd>
            velg
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-cardBorder px-1">esc</kbd>
            lukk
          </span>
        </div>
      </div>
    </div>
  );
}
