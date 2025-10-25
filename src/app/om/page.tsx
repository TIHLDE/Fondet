import Navbar from "../../components/Navbar";
import ContactBox from "../../components/ContactBox";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-0 sm:p-8">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Om fondet</h1>
        </div>

        {/* Large top box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Om TIHLDE-fondet
            </h2>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                TIHLDE-fondet er et organ underlagt generalforsamlingen og er
                dermed sidestilt Hovedstyret. Dette er for at Hovedstyret ikke
                skal kunne påvirke fondets beslutninger. Fondet skal
                komplementere økonomien til TIHLDE ved å gi muligheten til å
                gjøre investeringer som ikke er en del av TIHLDEs budsjett.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
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
                <h3 className="text-xl font-semibold text-white mb-3">
                  Sammensetning
                </h3>
                <p className="mb-3">
                  Fondet har totalt 10 medlemmer og består av:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>1 Fondsforvalter</li>
                  <li>1 fra De Eldstes Raad</li>
                  <li>8 Ordinære medlemmer</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
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
                <h3 className="text-xl font-semibold text-white mb-3">
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
                <h3 className="text-xl font-semibold text-white mb-3">
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

        {/* Two boxes side by side */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left box */}
            <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                Strategi og vedtekter
              </h3>
              <div className="space-y-3">
                <a
                  href="https://drive.google.com/file/d/1Qkg6MFx0Qgxev2MyJ8YsfFHkg92E0E-p/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Fondets vedtekter
                </a>
                <a
                  href="https://drive.google.com/file/d/15zGyLCQvKOjn3aW9p5l1zqTm1Bod0UIK/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Fondets overordnede strategi
                </a>
              </div>
            </div>

            {/* Right box */}
            <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                Årsrapporter
              </h3>
              <div className="space-y-3">
                <a
                  href="https://drive.google.com/file/d/1elNEV5qC9pKON7UA9W4L1jbINO-Yfshg/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Årsrapport 2021
                </a>
                <a
                  href="https://drive.google.com/file/d/1uJ6WKTGz2xjkWRheneRtK0HgF81skZ_Z/view?usp=share_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Årsrapport 2022
                </a>
                <a
                  href="https://drive.google.com/file/d/1lSWyh7RhnsUhej0nJu9O-ATqqmYNsgOW/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Årsrapport 2023
                </a>
                <a
                  href="https://drive.google.com/file/d/18B9gpWVnZFXWxGHKIgTT5qdWJp2ezhHE/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Årsrapport 2024
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0">
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
