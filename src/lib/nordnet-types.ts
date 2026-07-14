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
