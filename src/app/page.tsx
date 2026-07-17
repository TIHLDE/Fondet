import ContactBox from "../components/ContactBox";
import NordnetProfileCard from "../components/NordnetProfileCard";
import FundTicker from "../components/FundTicker";
import KeyMetrics from "../components/KeyMetrics";
import FundPerformanceChart from "../components/FundPerformanceChart";
import PerformanceBars from "../components/PerformanceBars";
import AllocationDonut from "../components/AllocationDonut";
import HoldingsTable from "../components/HoldingsTable";
import TradesList from "../components/TradesList";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-12 px-4 sm:px-0 pt-8 sm:pt-0">
          <h1 className="text-4xl font-bold text-foreground-primary">Fondet</h1>
        </div>

        <div className="w-full max-w-6xl mx-auto space-y-6 px-0 sm:px-0">
          {/* Scrolling YTD return per fund, live from Nordnet */}
          <FundTicker />

          <NordnetProfileCard />

          {/* At-a-glance metrics derived from the live holdings */}
          <KeyMetrics />

          {/* Performance of holdings vs. indexes, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <FundPerformanceChart />
            </div>
          </Reveal>

          {/* Return per fund, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <PerformanceBars />
            </div>
          </Reveal>

          {/* Published allocation from the newest report */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <AllocationDonut />
            </div>
          </Reveal>

          {/* Current holdings, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <HoldingsTable />
            </div>
          </Reveal>

          {/* Recent trades, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
              <TradesList />
            </div>
          </Reveal>

          <ContactBox />
        </div>
      </main>
    </div>
  );
}
