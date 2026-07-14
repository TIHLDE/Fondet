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
                TIHLDE-fondet er et organ underlagt generalforsamlingen og er
                dermed sidestilt Hovedstyret. Dette er for at Hovedstyret ikke
                skal kunne påvirke fondets beslutninger. Fondet skal
                komplementere økonomien til TIHLDE ved å gi muligheten til å
                gjøre investeringer som ikke er en del av TIHLDEs budsjett.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Formål
                </h3>
                <p className="mb-4">
                  Formålet til TIHLDE-fondet er å forvalte oppsparte midler på
                  en hensiktsmessig måte og i TIHLDEs beste interesse gjennom å
                  investere i ulike aksjefond. Fondet vil også ta innspill fra
                  TIHLDEs medlemmer om forslag til innkjøp som ikke blir
                  budsjettert. Dette kan være alt fra små investeringer som en
                  ny kaffetrakter til større investeringer som en egen
                  TIHLDE-kjeller.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Sammensetning
                </h3>
                <p className="mb-3">
                  Fondet har totalt 12 medlemmer og består av:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>1 Fondsforvalter</li>
                  <li>1 fra De Eldstes Raad</li>
                  <li>10 Ordinære medlemmer</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Forvalter
                </h3>
                <p className="mb-4">
                  Fondsforvalter sin hovedoppgave er å organisere og delegere
                  oppgaver til de andre medlemmene i fondet. Forvalter står for
                  kommunikasjon og formidling av informasjon ut til hovedstyret
                  og generalformsamlingen.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Eldste i forvaltningsgruppen
                </h3>
                <p className="mb-4">
                  Eldste i forvaltningsgruppen sin oppgave er å delta aktivt for
                  å vedlikeholde verdier og tradisjoner til linjeforeningen,
                  samt å delta aktivt i forvaltningen som fondet gjør. Dette er
                  et medlem som har vært med i hovedstyret tidligere.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  Medlemmer
                </h3>
                <p>
                  De resterende medlemmene sin hovedoppgave er å ha fokus på
                  forvaltning og valg av investeringer. Målet er å velge trygge
                  investeringer som linjeforeningen kan tjene på langsiktig.
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
