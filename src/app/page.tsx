import ContactBox from "../components/ContactBox";
import PortfolioChart from "../components/PortfolioChart";
import AllocationChart from "../components/AllocationChart";
export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div className="absolute left-0 right-0 top-0 bottom-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(90deg, rgba(30,64,175,0.2) 0%, rgba(59,130,246,0.3) 50%, rgba(96,165,250,0.2) 100%)'
          }}
        />
      </div>

      <main className="flex flex-col items-center justify-center relative z-10">
        {/* Title section with wave */}
        <div style={{ marginBottom: '32px', width: '100%' }}>
          <div style={{ paddingTop: '64px', paddingBottom: '0px', background: '#000000', overflowWrap: 'break-word' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <h1 className="text-4xl font-bold text-white" style={{ marginLeft: '13%', marginTop: '30px' }}>Fondet</h1>
            </div>
          </div>
          <svg viewBox="0 1.4 20 1.2" width="100%" height="80" preserveAspectRatio="none">
            <path fill="#000000" d="M 0 2 C 10 4 10 0 20 2 L 20 0 L 0 0 Z"></path>
          </svg>
        </div>

        <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-8 pb-8">
          {/* Portfolio return chart */}
          <div className="bg-cardBackground rounded-lg p-6">
            <PortfolioChart />
          </div>

          {/* Allocation donut chart */}
          <div className="bg-cardBackground rounded-lg p-6">
            <AllocationChart />
          </div>

          {/* Detailed table */}
          <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Fondets sammensetning (detaljer)
            </h2>

            <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-md">
              <div className="flex items-start space-x-3">
                <div className="shrink-0">
                  <svg
                    className="w-5 h-5 text-warning mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-warning font-semibold text-sm mb-1">
                    Viktig merknad
                  </h3>
                  <p className="text-foreground-secondary text-sm leading-relaxed">
                    Dette er bare veiledende tall da vi har mistet tilgang til
                    Nordnet API og kan derfor ikke gi dere nøyaktige tall på
                    dette tidspunktet. Index og Forvaltningsgruppen jobber på
                    saken.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cardBorder">
                    <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                      Fond
                    </th>
                    <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                      Andel
                    </th>
                    <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                      Utvikling
                    </th>
                    <th className="text-left py-3 px-4 text-foreground-primary font-semibold">
                      Kategori
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      DNB Finans A
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      4.7%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Bransjefond, Finans
                    </td>
                  </tr>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      Fondsfinans Utbytte B
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      9.5%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Norge
                    </td>
                  </tr>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      KLP AksjeEuropa Indeks P
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      15.6%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Europa, Store selskaper, Blanding
                    </td>
                  </tr>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      KLP AksjeGlobal Small Cap Indeks P
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      13.4%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Globale, Sm&aring;/mellomstore selskaper
                    </td>
                  </tr>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      Nordnet Danmark Indeks B
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      15.0%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Danmark
                    </td>
                  </tr>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      Nordnet Sverige Index
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      18.0%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Sverige
                    </td>
                  </tr>
                  <tr className="border-b border-cardBorder">
                    <td className="py-3 px-4 text-foreground-secondary">
                      Nordnet USA Indeks
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      18.9%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      USA, Store selskaper, Blanding
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-foreground-secondary">
                      &Ouml;hman Global Growth A
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      5.0%
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">-</td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      Bransjefond, Teknologi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Box */}
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
