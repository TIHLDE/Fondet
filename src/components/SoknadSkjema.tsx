"use client";

import { useState } from "react";

interface BudsjettPost {
  utgift: string;
  sum: string;
}

export default function SoknadSkjema() {
  const [sokerNavn, setSokerNavn] = useState("");
  const [kontaktperson, setKontaktperson] = useState("");
  const [telefon, setTelefon] = useState("");
  const [epost, setEpost] = useState("");
  const [hvemSoker, setHvemSoker] = useState("");
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
    setSending(true);

    const res = await fetch("/api/soknad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sokerNavn,
        kontaktperson,
        telefon,
        epost,
        hvemSoker,
        onsketSum,
        hvaStotte,
        begrunnelse,
        konsekvenser,
        budsjett,
        tillegg,
      }),
    });

    if (res.ok) {
      setResult({
        ok: true,
        msg: "Søknaden er sendt! Du vil høre fra oss.",
      });
    } else {
      const data = await res.json();
      setResult({ ok: false, msg: data.error || "Noe gikk galt" });
    }
    setSending(false);
  }

  const inputClass =
    "w-full px-4 py-3 bg-[hsl(217,62%,8%)] border border-[hsl(217,62%,20%)] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition";
  const labelClass = "block text-sm font-semibold text-white mb-1";

  return (
    <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 sm:p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Søknadsskjema
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avsender */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Avsender</h3>
          <div>
            <label className={labelClass}>Hvem søker? *</label>
            <input
              required
              className={inputClass}
              value={sokerNavn}
              onChange={(e) => setSokerNavn(e.target.value)}
              placeholder="F.eks. Drift, HS, Promo..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kontaktperson *</label>
              <input
                required
                className={inputClass}
                value={kontaktperson}
                onChange={(e) => setKontaktperson(e.target.value)}
                placeholder="Fullt navn"
              />
            </div>
            <div>
              <label className={labelClass}>Telefon *</label>
              <input
                required
                type="tel"
                className={inputClass}
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="Telefonnummer"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>E-post *</label>
            <input
              required
              type="email"
              className={inputClass}
              value={epost}
              onChange={(e) => setEpost(e.target.value)}
              placeholder="din@epost.no"
            />
          </div>
        </div>

        {/* Formål */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Formål</h3>
          <p className="text-sm text-gray-400">
            Grei ut når dere forklarer og begrunner. Forsøk å være så
            detaljert som mulig, slik at det blir enklere for oss å fatte en
            god beslutning.
          </p>

          <div>
            <label className={labelClass}>
              Hvem søker? (Navn og eventuell undergruppe, interessegruppe,
              komité etc.) *
            </label>
            <textarea
              required
              rows={3}
              className={inputClass}
              value={hvemSoker}
              onChange={(e) => setHvemSoker(e.target.value)}
              placeholder="Beskriv hvem som søker..."
            />
          </div>

          <div>
            <label className={labelClass}>Ønsket sum (kr) *</label>
            <input
              required
              type="number"
              min={5000}
              className={inputClass}
              value={onsketSum}
              onChange={(e) => setOnsketSum(e.target.value)}
              placeholder="Minimum 5 000 kr"
            />
          </div>

          <div>
            <label className={labelClass}>
              Forklar hva det søkes om støtte til *
            </label>
            <textarea
              required
              rows={4}
              className={inputClass}
              value={hvaStotte}
              onChange={(e) => setHvaStotte(e.target.value)}
              placeholder="Beskriv hva støtten skal brukes til..."
            />
          </div>

          <div>
            <label className={labelClass}>
              Begrunn hvorfor støtte skal tildeles *
            </label>
            <textarea
              required
              rows={4}
              className={inputClass}
              value={begrunnelse}
              onChange={(e) => setBegrunnelse(e.target.value)}
              placeholder="Forklar hvorfor dette er en god investering for TIHLDE..."
            />
          </div>

          <div>
            <label className={labelClass}>
              Konsekvenser dersom støtte ikke tildeles
            </label>
            <textarea
              rows={3}
              className={inputClass}
              value={konsekvenser}
              onChange={(e) => setKonsekvenser(e.target.value)}
              placeholder="Hva skjer hvis søknaden ikke innvilges?"
            />
          </div>
        </div>

        {/* Budsjett */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Budsjett</h3>
          <p className="text-sm text-gray-400">
            Av budsjettet skal det fremgå pris på alle individuelle utgifter
            støtten skal brukes til. Forsøk å finne realistiske priser.
          </p>

          <div className="space-y-3">
            {budsjett.map((post, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  className={inputClass}
                  placeholder="Utgift"
                  value={post.utgift}
                  onChange={(e) =>
                    updateBudsjett(i, "utgift", e.target.value)
                  }
                />
                <div className="relative w-40 shrink-0">
                  <input
                    type="number"
                    className={inputClass + " pr-10"}
                    placeholder="Sum"
                    value={post.sum}
                    onChange={(e) =>
                      updateBudsjett(i, "sum", e.target.value)
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    kr
                  </span>
                </div>
                {budsjett.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBudsjettPost(i)}
                    className="text-red-400 hover:text-red-300 text-lg shrink-0"
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
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            + Legg til utgift
          </button>

          <div className="flex justify-between items-center pt-3 border-t border-[hsl(217,62%,20%)]">
            <span className="font-semibold text-white">Total sum</span>
            <span className="font-semibold text-white">
              {totalBudsjett.toLocaleString("nb-NO")} kr
            </span>
          </div>
        </div>

        {/* Tillegg */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">
            Tilleggsinformasjon
          </h3>
          <textarea
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
            className={`p-4 rounded-lg text-sm font-medium ${
              result.ok
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
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
