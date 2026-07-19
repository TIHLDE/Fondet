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
  performanceFiveYears: number | null;
  // Morningstar rating (1-5) and SFDR article (6/8/9), from Nordnet.
  rating: number | null;
  esgArticle: number | null;
  // Published in the newest quarterly report. Null for funds held but not yet
  // in a report (bought after it was published).
  weight: number | null;
  feePercent: number | null;
  benchmark: string | null;
  // Link to the fund's Morningstar prospectus/KID document, from Nordnet.
  prospectusUrl: string | null;
}

// One fund's line in the newest quarterly report allocation, minus funds
// confirmed fully sold since the report. Weights are the published ones, so
// they sum to ~100 while nothing has been sold out since.
export interface FordelingFund {
  name: string;
  weight: number;
  feePercent: number | null;
  benchmark: string | null;
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
  // The full published allocation from the newest report, weights summing to
  // ~100. Empty if no report could be read.
  fordeling: FordelingFund[];
  // Report period the weights come from, e.g. "Q4 2025". Null if no report
  // could be read.
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
