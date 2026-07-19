import ContactBox from "../components/ContactBox";
import NordnetProfileCard from "../components/NordnetProfileCard";
import FundTicker from "../components/FundTicker";
import BackToTop from "../components/BackToTop";
import FundPerformanceChart from "../components/FundPerformanceChart";
import PerformanceBars from "../components/PerformanceBars";
import AllocationDonut from "../components/AllocationDonut";
import ReturnsMatrix from "../components/ReturnsMatrix";
import HoldingsTable from "../components/HoldingsTable";
import TradesList from "../components/TradesList";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-primary overflow-x-hidden">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        {/* Full-width terminal ticker: YTD return per fund, live from Nordnet */}
        <FundTicker />

        <div className="text-center mb-12 mt-10 px-4 sm:px-0">
          <h1 className="text-4xl font-bold text-foreground-primary">
            TIHLDE sitt fond
          </h1>
        </div>

        <div className="w-full max-w-6xl mx-auto space-y-6 px-0 sm:px-0">
          <NordnetProfileCard />

          {/* Performance of holdings vs. indexes, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg card-hover">
              <FundPerformanceChart />
            </div>
          </Reveal>

          {/* Return per fund, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg card-hover">
              <PerformanceBars />
            </div>
          </Reveal>

          {/* Published allocation from the newest report */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg card-hover">
              <AllocationDonut />
            </div>
          </Reveal>

          {/* Return per fund across periods, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg card-hover">
              <ReturnsMatrix />
            </div>
          </Reveal>

          {/* Current holdings, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg card-hover">
              <HoldingsTable />
            </div>
          </Reveal>

          {/* Recent trades, live from Nordnet */}
          <Reveal>
            <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg card-hover">
              <TradesList />
            </div>
          </Reveal>

          <ContactBox />
        </div>
      </main>
      <BackToTop />
    </div>
  );
}
