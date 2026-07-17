// Shapes returned by /api/nordnet, shared by the client components.

export interface NordnetProfile {
  id: string;
  username: string;
  avatarUri: string;
  slug: string;
  rating: number;
  joinedAt: number;
  followerCount: number;
  followingCount: number;
}

export interface Holding {
  name: string;
  legacyInstrumentId: number;
  orderBookId: string;
  logoUrl: string | null;
  lastTradeDate: string;
  category: string | null;
  isin: string | null;
  nav: number | null;
  navDate: string | null;
  performanceThisYear: number | null;
  performanceOneMonth: number | null;
  performanceThreeYears: number | null;
  // Published portfolio weight in %, from the newest quarterly report. Null for
  // funds held but not yet in a report (bought after it was published).
  weight: number | null;
}

export interface Trade {
  date: string;
  tradeType: "BUY" | "SELL";
  name: string;
  price: number;
  currency: string;
  logoUrl: string | null;
  legacyInstrumentId: number;
  orderBookId: string;
}

export interface NordnetData {
  profile: NordnetProfile | null;
  holdings: Holding[];
  trades: Trade[];
  // Report period the holding weights come from, e.g. "Q4 2025". Null if no
  // report could be read.
  weightAsOf: string | null;
}

export interface SeriesPoint {
  time: number;
  value: number;
}

export interface Series {
  label: string;
  kind: "fund" | "index";
  points: SeriesPoint[];
}

export interface SeriesResponse {
  period: string;
  series: Series[];
}
