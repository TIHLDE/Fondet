import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om fondet",
};

export default function About() {
  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-foreground-primary mb-8">Om fondet</h1>
        </div>

        {/* Large top box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground-primary mb-6">
              Om TIHLDE-fondet
            </h2>

            <div className="space-y-6 text-foreground-secondary leading-relaxed">
              <p className="text-lg">
                TIHLDE-fondet forvalter linjeforeningens oppsparte midler.
                Fondet er underlagt generalforsamlingen og sidestilt
                Hovedstyret, slik at Hovedstyret ikke kan påvirke beslutningene
                som tas. Midlene skal komme medlemmene til gode gjennom
                investeringer som ikke dekkes av TIHLDEs ordinære budsjett.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Formål
                </h3>
                <p className="mb-4">
                  Pengene står i aksjefond, og målet er trygg og langsiktig
                  avkastning i TIHLDEs interesse. Fondet tar også imot forslag
                  fra TIHLDEs medlemmer om innkjøp som ikke er budsjettert. Det
                  kan være smått, som en ny kaffetrakter, eller stort, som en
                  egen TIHLDE-kjeller.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Sammensetning
                </h3>
                <p className="mb-3">Fondet har tolv medlemmer:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>1 fondsforvalter</li>
                  <li>1 fra De Eldstes Raad</li>
                  <li>10 ordinære medlemmer</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Forvalter
                </h3>
                <p className="mb-4">
                  Fondsforvalteren organiserer arbeidet og delegerer oppgaver
                  til resten av gruppen. Forvalteren er også fondets stemme
                  utad, og holder Hovedstyret og generalforsamlingen oppdatert
                  om hvordan det går.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Eldste i forvaltningsgruppen
                </h3>
                <p className="mb-4">
                  Ett av medlemmene kommer fra De Eldstes Raad og har tidligere
                  sittet i Hovedstyret. Rollen skal ta vare på verdiene og
                  tradisjonene i linjeforeningen, og deltar ellers i
                  forvaltningen på lik linje med de andre.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Medlemmer
                </h3>
                <p>
                  De ti ordinære medlemmene står for selve forvaltningen. De
                  følger markedet, vurderer fondene og velger investeringer som
                  linjeforeningen kan tjene på over tid.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <Link
            href="/reports"
            className="block bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg hover:border-gray-500 transition-colors text-center"
          >
            <span className="text-foreground-secondary font-medium">
              Årsrapporter, strategi og vedtekter finner du under Rapporter &rarr;
            </span>
          </Link>
        </div>

      </main>
    </div>
  );
}
