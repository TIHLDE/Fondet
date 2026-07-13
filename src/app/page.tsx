import ContactBox from "../components/ContactBox";
import PortfolioChart from "../components/PortfolioChart";
import AllocationChart from "../components/AllocationChart";
import FundDetailsTable from "../components/FundDetailsTable";
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
          <FundDetailsTable />

          {/* Contact Box */}
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
