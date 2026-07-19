"use client";

import { useEffect, useState } from "react";
import {
  TIHLDE_GROUPS,
  validateSoknad,
  validKontaktperson,
  validTelefon,
  validEpost,
  wordCount,
  MIN_SUM,
  MAX_SUM,
  MIN_WORDS,
  MIN_WORDS_KONSEKVENSER,
} from "@/lib/soknad-validation";

interface BudsjettPost {
  utgift: string;
  sum: string;
}

// Draft persists across accidental navigation within the tab; cleared on
// successful submit. sessionStorage, not localStorage, so drafts do not
// linger on shared machines.
const DRAFT_KEY = "soknad-draft";

interface Draft {
  sokerNavn: string;
  kontaktperson: string;
  telefon: string;
  epost: string;
  onsketSum: string;
  hvaStotte: string;
  begrunnelse: string;
  konsekvenser: string;
  budsjett: BudsjettPost[];
  tillegg: string;
}

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

export default function SoknadSkjema() {
  const [sokerNavn, setSokerNavn] = useState("");
  const [kontaktperson, setKontaktperson] = useState("");
  const [telefon, setTelefon] = useState("");
  const [epost, setEpost] = useState("");
  const [onsketSum, setOnsketSum] = useState("");
  const [hvaStotte, setHvaStotte] = useState("");
  const [begrunnelse, setBegrunnelse] = useState("");
  const [konsekvenser, setKonsekvenser] = useState("");
  const [budsjett, setBudsjett] = useState<BudsjettPost[]>([
    { utgift: "", sum: "" },
  ]);
  const [tillegg, setTillegg] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Restore any draft after mount; sessionStorage is unavailable during SSR.
  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    setSokerNavn(draft.sokerNavn ?? "");
    setKontaktperson(draft.kontaktperson ?? "");
    setTelefon(draft.telefon ?? "");
    setEpost(draft.epost ?? "");
    setOnsketSum(draft.onsketSum ?? "");
    setHvaStotte(draft.hvaStotte ?? "");
    setBegrunnelse(draft.begrunnelse ?? "");
    setKonsekvenser(draft.konsekvenser ?? "");
    if (draft.budsjett?.length) setBudsjett(draft.budsjett);
    setTillegg(draft.tillegg ?? "");
  }, []);

  useEffect(() => {
    const draft: Draft = {
      sokerNavn,
      kontaktperson,
      telefon,
      epost,
      onsketSum,
      hvaStotte,
      begrunnelse,
      konsekvenser,
      budsjett,
      tillegg,
    };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Storage full or blocked; the form still works without drafts.
    }
  }, [
    sokerNavn,
    kontaktperson,
    telefon,
    epost,
    onsketSum,
    hvaStotte,
    begrunnelse,
    konsekvenser,
    budsjett,
    tillegg,
  ]);

  function checkField(name: string, value: string) {
    let err = "";
    if (value.trim()) {
      switch (name) {
        case "kontaktperson":
          if (!validKontaktperson(value))
            err = "Oppgi fullt navn (fornavn og etternavn)";
          break;
        case "telefon":
          if (!validTelefon(value))
            err = "8 siffer, eventuelt med +47";
          break;
        case "epost":
          if (!validEpost(value)) err = "Ugyldig e-postadresse";
          break;
        case "onsketSum":
          if (!(Number(value) >= MIN_SUM))
            err = "Minimum søknadssum er 5 000 kr";
          break;
        case "hvaStotte":
        case "begrunnelse":
          if (wordCount(value) < MIN_WORDS)
            err = `Beskriv med minst ${MIN_WORDS} ord (${wordCount(value)} nå)`;
          break;
        case "konsekvenser":
          if (wordCount(value) < MIN_WORDS_KONSEKVENSER)
            err = `Beskriv med minst ${MIN_WORDS_KONSEKVENSER} ord`;
          break;
      }
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  }

  function fieldError(name: string) {
    const err = fieldErrors[name];
    if (!err) return null;
    return (
      <p
        id={`${name}-error`}
        className="mt-1 text-sm text-red-600 dark:text-red-400"
        role="alert"
      >
        {err}
      </p>
    );
  }

  function addBudsjettPost() {
    setBudsjett([...budsjett, { utgift: "", sum: "" }]);
  }

  function removeBudsjettPost(i: number) {
    setBudsjett(budsjett.filter((_, j) => j !== i));
  }

  function updateBudsjett(
    i: number,
    field: keyof BudsjettPost,
    value: string
  ) {
    const updated = [...budsjett];
    updated[i] = { ...updated[i], [field]: value };
    setBudsjett(updated);
  }

  const totalBudsjett = budsjett.reduce(
    (acc, b) => acc + (Number(b.sum) || 0),
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const soknad = {
      sokerNavn,
      kontaktperson,
      telefon,
      epost,
      onsketSum,
      hvaStotte,
      begrunnelse,
      konsekvenser,
      budsjett,
    };

    const feil = validateSoknad(soknad);
    if (feil) {
      setResult({ ok: false, msg: feil });
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/soknad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...soknad, tillegg }),
      });

      if (res.ok) {
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        setResult({
          ok: true,
          msg: "Søknaden er sendt! Du vil høre fra oss.",
        });
      } else {
        const data = await res.json().catch(() => null);
        setResult({ ok: false, msg: data?.error || "Noe gikk galt" });
      }
    } catch {
      setResult({
        ok: false,
        msg: "Fikk ikke kontakt med serveren. Sjekk nettforbindelsen og prøv igjen. Utfyllingen din er ikke mistet.",
      });
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-background border border-cardBorder rounded-lg text-foreground-primary placeholder:text-foreground-secondary focus:outline-none focus:border-blue-500 transition";

  const inputWithError = (name: string) =>
    fieldErrors[name]
      ? inputClass.replace("border-cardBorder", "border-red-500")
      : inputClass;
  const labelClass = "block text-sm font-semibold text-foreground-primary mb-1";

  return (
    <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-foreground-primary mb-6">
        Søknadsskjema
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avsender */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground-primary">Avsender</h3>
          <div>
            <label htmlFor="soker-navn" className={labelClass}>Hvem søker? *</label>
            <select
              id="soker-navn"
              required
              className={inputClass}
              value={sokerNavn}
              onChange={(e) => setSokerNavn(e.target.value)}
            >
              <option value="" disabled>
                Velg gruppe...
              </option>
              {Object.entries(TIHLDE_GROUPS).map(([kategori, grupper]) => (
                <optgroup key={kategori} label={kategori}>
                  {grupper.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="kontaktperson" className={labelClass}>Kontaktperson *</label>
              <input
                id="kontaktperson"
                required
                className={inputWithError("kontaktperson")}
                value={kontaktperson}
                onChange={(e) => setKontaktperson(e.target.value)}
                onBlur={(e) => checkField("kontaktperson", e.target.value)}
                aria-invalid={!!fieldErrors["kontaktperson"]}
                aria-describedby={
                  fieldErrors["kontaktperson"] ? "kontaktperson-error" : undefined
                }
                placeholder="Fullt navn"
              />
              {fieldError("kontaktperson")}
            </div>
            <div>
              <label htmlFor="telefon" className={labelClass}>Telefon *</label>
              <input
                id="telefon"
                required
                type="tel"
                inputMode="tel"
                pattern="(\+47)?[0-9 ]{8,}"
                className={inputWithError("telefon")}
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                onBlur={(e) => checkField("telefon", e.target.value)}
                aria-invalid={!!fieldErrors["telefon"]}
                aria-describedby={
                  fieldErrors["telefon"] ? "telefon-error" : undefined
                }
                placeholder="Telefonnummer"
              />
              {fieldError("telefon")}
            </div>
          </div>
          <div>
            <label htmlFor="epost" className={labelClass}>E-post *</label>
            <input
              id="epost"
              required
              type="email"
              className={inputWithError("epost")}
              value={epost}
              onChange={(e) => setEpost(e.target.value)}
              onBlur={(e) => checkField("epost", e.target.value)}
              aria-invalid={!!fieldErrors["epost"]}
              aria-describedby={fieldErrors["epost"] ? "epost-error" : undefined}
              placeholder="din@epost.no"
            />
            {fieldError("epost")}
          </div>
        </div>

        {/* Formål */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground-primary">Formål</h3>
          <p className="text-sm text-foreground-secondary">
            Grei ut når dere forklarer og begrunner. Forsøk å være så
            detaljert som mulig, slik at det blir enklere for oss å fatte en
            god beslutning.
          </p>

          <div>
            <label htmlFor="onsket-sum" className={labelClass}>Ønsket sum (kr) *</label>
            <input
              id="onsket-sum"
              required
              type="number"
              min={5000}
              className={inputWithError("onsketSum")}
              value={onsketSum}
              onChange={(e) => setOnsketSum(e.target.value)}
              onBlur={(e) => checkField("onsketSum", e.target.value)}
              aria-invalid={!!fieldErrors["onsketSum"]}
              aria-describedby={
                fieldErrors["onsketSum"] ? "onsketSum-error" : undefined
              }
              placeholder="Minimum 5 000 kr"
            />
            {fieldError("onsketSum")}
            {Number(onsketSum) > MAX_SUM && (
              <p
                id="onsketSum-warning"
                className="mt-1 text-sm text-amber-700 dark:text-amber-400"
              >
                Beløp over {MAX_SUM.toLocaleString("nb-NO")} kr må vedtas av
                generalforsamlingen. Du kan fortsatt sende inn søknaden.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="hva-stotte" className={labelClass}>
              Forklar hva det søkes om støtte til *
            </label>
            <textarea
              id="hva-stotte"
              required
              rows={4}
              className={inputWithError("hvaStotte")}
              value={hvaStotte}
              onChange={(e) => setHvaStotte(e.target.value)}
              onBlur={(e) => checkField("hvaStotte", e.target.value)}
              aria-invalid={!!fieldErrors["hvaStotte"]}
              aria-describedby={
                fieldErrors["hvaStotte"] ? "hvaStotte-error" : undefined
              }
              placeholder="Beskriv hva støtten skal brukes til..."
            />
            {fieldError("hvaStotte")}
          </div>

          <div>
            <label htmlFor="begrunnelse" className={labelClass}>
              Begrunn hvorfor støtte skal tildeles *
            </label>
            <textarea
              id="begrunnelse"
              required
              rows={4}
              className={inputWithError("begrunnelse")}
              value={begrunnelse}
              onChange={(e) => setBegrunnelse(e.target.value)}
              onBlur={(e) => checkField("begrunnelse", e.target.value)}
              aria-invalid={!!fieldErrors["begrunnelse"]}
              aria-describedby={
                fieldErrors["begrunnelse"] ? "begrunnelse-error" : undefined
              }
              placeholder="Forklar hvorfor dette er en god investering for TIHLDE..."
            />
            {fieldError("begrunnelse")}
          </div>

          <div>
            <label htmlFor="konsekvenser" className={labelClass}>
              Konsekvenser dersom støtte ikke tildeles *
            </label>
            <textarea
              id="konsekvenser"
              required
              rows={3}
              className={inputWithError("konsekvenser")}
              value={konsekvenser}
              onChange={(e) => setKonsekvenser(e.target.value)}
              onBlur={(e) => checkField("konsekvenser", e.target.value)}
              aria-invalid={!!fieldErrors["konsekvenser"]}
              aria-describedby={
                fieldErrors["konsekvenser"] ? "konsekvenser-error" : undefined
              }
              placeholder="Hva skjer hvis søknaden ikke innvilges?"
            />
            {fieldError("konsekvenser")}
          </div>
        </div>

        {/* Budsjett */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground-primary">Budsjett</h3>
          <p className="text-sm text-foreground-secondary">
            Av budsjettet skal det fremgå pris på alle individuelle utgifter
            støtten skal brukes til. Forsøk å finne realistiske priser.
          </p>

          <div className="space-y-3">
            {budsjett.map((post, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  required
                  className={inputClass}
                  placeholder="Utgift"
                  aria-label={`Utgift ${i + 1}`}
                  value={post.utgift}
                  onChange={(e) =>
                    updateBudsjett(i, "utgift", e.target.value)
                  }
                />
                <div className="relative w-40 shrink-0">
                  <input
                    required
                    type="number"
                    min={1}
                    className={inputClass + " pr-10"}
                    placeholder="Sum"
                    aria-label={`Sum for utgift ${i + 1}`}
                    value={post.sum}
                    onChange={(e) =>
                      updateBudsjett(i, "sum", e.target.value)
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary text-sm">
                    kr
                  </span>
                </div>
                {budsjett.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBudsjettPost(i)}
                    aria-label={`Fjern utgift ${i + 1}`}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg shrink-0 min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addBudsjettPost}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium min-h-11 inline-flex items-center px-2 -mx-2 rounded-lg transition-colors"
          >
            + Legg til utgift
          </button>

          <div className="flex justify-between items-center pt-3 border-t border-cardBorder">
            <span className="font-semibold text-foreground-primary">Total sum</span>
            <span className="font-semibold text-foreground-primary">
              {totalBudsjett.toLocaleString("nb-NO")} kr
            </span>
          </div>
        </div>

        {/* Tillegg */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground-primary">
            Tilleggsinformasjon
          </h3>
          <textarea
            aria-label="Tilleggsinformasjon"
            rows={4}
            className={inputClass}
            value={tillegg}
            onChange={(e) => setTillegg(e.target.value)}
            placeholder="Annen relevant informasjon eller vedlegg-lenker..."
          />
        </div>

        {/* Result */}
        {result && (
          <div
            role={result.ok ? "status" : "alert"}
            className={`p-4 rounded-lg text-sm font-medium ${
              result.ok
                ? "bg-green-100 border border-green-700 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 border border-red-700 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {result.msg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={sending}
          className="w-full py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {sending ? "Sender søknad..." : "Send inn søknad"}
        </button>
      </form>
    </div>
  );
}
