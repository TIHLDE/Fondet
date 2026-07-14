import Link from "next/link";
import type { Metadata } from "next";
import SoknaderTable from "@/components/SoknaderTable";

export const metadata: Metadata = {
  title: "Søk om støtte",
};

export default function Apply() {
  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-foreground-primary mb-8">
            Søk om støtte
          </h1>
        </div>

        {/* Information Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
            <div className="space-y-8">
              {/* Før du søker section */}
              <div>
                <h2 className="text-xl font-semibold text-foreground-primary mb-4">
                  Før du søker
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  Det finnes et utall forskjellige støtteordninger som
                  administreres av ulike organisasjoner. Vi ber deg derfor sette
                  deg inn i hvilke andre støtteordninger som finnes, og søke der
                  det kan være muligheter før du søker støtte fra TIHLDE-fondet.
                  Oversikten over andre plasser kan finnes her. Dersom du ikke
                  får støtte andre steder, eller ditt initiativ ikke rimelig kan
                  dekkes av noen andre støtteordninger er du velkommen til å
                  søke støtte fra oss.
                </p>
              </div>

              {/* Hvordan søke om støtte section */}
              <div>
                <h2 className="text-xl font-semibold text-foreground-primary mb-4">
                  Hvordan søke om støtte
                </h2>
                <p className="text-foreground-secondary mb-4">
                  Kravene en søknad må oppfylle er følgende:
                </p>

                <ul className="space-y-3 text-foreground-secondary">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>Kun medlemmer av TIHLDE kan søke om støtte.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      Søknad skal inneholde navn på søker, formålet med søknad,
                      ønsket sum og budsjettering for bruk av midlene.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      Søknad skal være begrunnet og ha som mål å kunne gi en
                      positiv avkastning for TIHLDEs medlemmer.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong>Minimumsbeløp:</strong> 5000 kr. For beløp som er
                      mindre enn dette kan du spørre hs@tihlde.org.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong>Maksimumsbeløp:</strong> 100 000 kr. Beløp som
                      overstiger dette kan ikke behandles internt, og må vedtas
                      av generalforsamlingen.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      Fondet skal kun brukes til investeringer/kjøp som
                      linjeforeningen ikke har budsjettert for.
                    </span>
                  </li>
                </ul>

                <p className="text-foreground-secondary mt-6 leading-relaxed">
                  Søknaden sendes inn via skjemaet under. Husk å oppgi et
                  budsjett som viser hvordan midlene skal brukes.
                </p>
              </div>

              {/* Søk støtte button */}
              <div className="flex justify-center pt-4">
                <Link
                  href="/apply/skjema"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-500 text-foreground-primary font-semibold rounded-lg transition-colors text-lg"
                >
                  Søk støtte
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Applications Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground-primary mb-6">
              Tidligere søknader
            </h2>
            <SoknaderTable />
          </div>
        </div>

      </main>
    </div>
  );
}
