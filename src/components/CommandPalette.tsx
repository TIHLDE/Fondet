"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Home, FileText, Users, Send, Sun, Moon, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

type Command = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  icon: LucideIcon;
  run: () => void;
};

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
    return [
      { id: "home", label: "Forsiden", hint: "Oversikt og live tall", keywords: "hjem start portefolje dashboard", icon: Home, run: go("/") },
      { id: "about", label: "Om fondet", hint: "Hva Fondet er", keywords: "about historie", icon: FileText, run: go("/about") },
      { id: "reports", label: "Rapporter", hint: "Kvartals- og arsrapporter", keywords: "reports kvartal arsrapport dokumenter soknader", icon: FileText, run: go("/reports") },
      { id: "group", label: "Forvaltningsgruppen", hint: "Medlemmer", keywords: "group gruppe medlemmer team", icon: Users, run: go("/group") },
      { id: "group-prev", label: "Tidligere medlemmer", hint: "Arkiv", keywords: "tidligere alumni historikk", icon: Users, run: go("/group/tidligere") },
      { id: "apply", label: "Søk om støtte", hint: "Slik søker du", keywords: "apply soknad stotte penger", icon: Send, run: go("/apply") },
      { id: "apply-form", label: "Søknadsskjema", hint: "Fyll ut og send", keywords: "skjema form soknad", icon: Send, run: go("/apply/skjema") },
      { id: "theme-light", label: "Lyst tema", hint: "Bytt utseende", keywords: "theme lys light dag", icon: Sun, run: () => { setTheme("light"); setOpen(false); } },
      { id: "theme-dark", label: "Mørkt tema", hint: "Bytt utseende", keywords: "theme mork dark natt", icon: Moon, run: () => { setTheme("dark"); setOpen(false); } },
      { id: "theme-system", label: "Systemtema", hint: "Følg operativsystemet", keywords: "theme system auto", icon: Monitor, run: () => { setTheme("system"); setOpen(false); } },
    ];
  }, [router, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords.includes(q),
    );
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
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[15vh]"
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
              filtered[active] ? `cmd-opt-${active}` : undefined
            }
            aria-autocomplete="list"
            placeholder="Søk sider og handlinger…"
            className="w-full bg-transparent py-3.5 text-foreground-primary placeholder:text-foreground-secondary focus:outline-none"
          />
        </div>

        <ul id="cmd-listbox" role="listbox" className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-foreground-secondary">
              Ingen treff
            </li>
          )}
          {filtered.map((c, i) => {
            const Icon = c.icon;
            const selected = i === active;
            return (
              <li
                key={c.id}
                id={`cmd-opt-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                className={`mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                  selected ? "bg-cardBorder/50" : ""
                }`}
              >
                <Icon className="h-4 w-4 text-accent shrink-0" aria-hidden />
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm text-foreground-primary">
                    {c.label}
                  </span>
                  <span className="block truncate text-xs text-foreground-secondary">
                    {c.hint}
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
      </div>
    </div>
  );
}
