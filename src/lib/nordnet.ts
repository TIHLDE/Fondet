// Server-side integration against Nordnet's public (unauthenticated) APIs.
// Holdings weights are not public, so composition is derived from the public
// trade feed: a fund counts as held when its most recent trade is a buy.

const PROFILE_SLUG = "tihlde-forvaltningsgruppen";
const SHAREVILLE = "https://api.prod.nntech.io/shareville";
const MARKET_DATA = "https://api.prod.nntech.io/market-data";
const NORDNET_API = "https://www.nordnet.no/api/2";

const UA = "Mozilla/5.0 (compatible; fondet.tihlde.org)";

const shortHeaders = { "User-Agent": UA, Accept: "application/json" };
// market-data rejects requests without a nordnet.no referer
const marketDataHeaders = {
  ...shortHeaders,
  Referer: "https://www.nordnet.no/",
  "x-locale": "nb-NO",
};
const legacyApiHeaders = { ...shortHeaders, "client-id": "NEXT" };

const REVALIDATE = 1800;

async function getJSON<T>(
  url: string,
  headers: Record<string, string>,
): Promise<T | null> {
  try {
    const res = await fetch(url, { headers, next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

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

export async function getProfile(): Promise<NordnetProfile | null> {
  return getJSON<NordnetProfile>(
    `${SHAREVILLE}/v3/profiles/slug/${PROFILE_SLUG}`,
    shortHeaders,
  );
}

interface FeedInstrument {
  name: string;
  logoUrl?: string;
  legacyInstrumentId: number;
  marketDataOrderBookId: string;
  isFund: boolean;
}

interface FeedEntry {
  type: string;
  tradeType?: "BUY" | "SELL";
  postedAt: string;
  price?: number;
  currency?: string;
  instrument?: FeedInstrument;
}

interface FeedPage {
  endOfFeed: boolean;
  feed: FeedEntry[];
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

const FEED_PAGE_SIZE = 50;
const FEED_MAX_PAGES = 6;

export async function getTrades(): Promise<Trade[]> {
  const profile = await getProfile();
  if (!profile) return [];

  const trades: Trade[] = [];
  for (let page = 0; page < FEED_MAX_PAGES; page++) {
    const data = await getJSON<FeedPage>(
      `${SHAREVILLE}/v4/profiles/${profile.id}/activity-feed?limit=${FEED_PAGE_SIZE}&offset=${page * FEED_PAGE_SIZE}`,
      shortHeaders,
    );
    if (!data) break;
    for (const entry of data.feed) {
      if (entry.type !== "TRADE" || !entry.instrument || !entry.tradeType)
        continue;
      trades.push({
        date: entry.postedAt,
        tradeType: entry.tradeType,
        name: entry.instrument.name,
        price: entry.price ?? 0,
        currency: entry.currency ?? "NOK",
        logoUrl: entry.instrument.logoUrl ?? null,
        legacyInstrumentId: entry.instrument.legacyInstrumentId,
        orderBookId: entry.instrument.marketDataOrderBookId,
      });
    }
    if (data.endOfFeed) break;
  }
  return trades;
}

interface InstrumentInfo {
  instrument_id: number;
  name: string;
  category?: string;
  isin_code?: string;
  currency?: string;
  last_nav?: number;
  last_nav_date?: string;
  rating?: number;
  sfdr_article?: number;
  prospectus_url?: string;
  institute?: string;
  performance_one_month?: number;
  performance_this_year?: number;
  performance_three_years?: number;
  performance_five_years?: number;
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
  rating: number | null;
  esgArticle: number | null;
  prospectusUrl: string | null;
}

export async function getHoldings(trades: Trade[]): Promise<Holding[]> {
  // trades arrive newest first; the first trade seen per instrument is the latest
  const latest = new Map<number, Trade>();
  for (const t of trades) {
    if (!latest.has(t.legacyInstrumentId)) latest.set(t.legacyInstrumentId, t);
  }
  const held = Array.from(latest.values()).filter(
    (t) => t.tradeType === "BUY",
  );

  const enriched = await Promise.all(
    held.map(async (t) => {
      const info = await getJSON<InstrumentInfo[]>(
        `${NORDNET_API}/instruments/${t.legacyInstrumentId}`,
        legacyApiHeaders,
      );
      const i = info?.[0];
      return {
        name: i?.name ?? t.name,
        legacyInstrumentId: t.legacyInstrumentId,
        orderBookId: t.orderBookId,
        logoUrl: t.logoUrl,
        lastTradeDate: t.date,
        category: i?.category ?? null,
        isin: i?.isin_code ?? null,
        nav: i?.last_nav ?? null,
        navDate: i?.last_nav_date ?? null,
        performanceThisYear: i?.performance_this_year ?? null,
        performanceOneMonth: i?.performance_one_month ?? null,
        performanceThreeYears: i?.performance_three_years ?? null,
        rating: i?.rating ?? null,
        esgArticle: i?.sfdr_article ?? null,
        prospectusUrl: i?.prospectus_url ?? null,
      };
    }),
  );
  return enriched.sort((a, b) => a.name.localeCompare(b.name, "nb"));
}

export type SeriesPeriod =
  | "MONTH_1"
  | "MONTH_3"
  | "MONTH_6"
  | "YEAR_1"
  | "YEAR_3"
  | "YEAR_5"
  | "YEAR_10";

export const SERIES_PERIODS: SeriesPeriod[] = [
  "MONTH_1",
  "MONTH_3",
  "MONTH_6",
  "YEAR_1",
  "YEAR_3",
  "YEAR_5",
  "YEAR_10",
];

interface PricePoint {
  timeStamp: number;
  value?: number;
  last?: number;
}

interface TimeSeries {
  timeSeriesIdentifier: string;
  pricePoints: PricePoint[];
}

export interface SeriesPoint {
  time: number;
  value: number;
}

// Funds return percentage development directly; indexes return absolute
// levels, so those are rebased to percent from the first point.
export async function getSeries(
  identifier: string,
  period: SeriesPeriod,
  isFund: boolean,
): Promise<SeriesPoint[]> {
  const fundParam = isFund ? "?fundType=FUND_NOK" : "";
  const data = await getJSON<TimeSeries>(
    `${MARKET_DATA}/v3/price-time-series/period/${period}/identifier/${identifier}${fundParam}`,
    marketDataHeaders,
  );
  if (!data?.pricePoints?.length) return [];

  const points = data.pricePoints
    .map((p) => ({ time: p.timeStamp, raw: p.value ?? p.last }))
    .filter((p): p is { time: number; raw: number } => typeof p.raw === "number");
  if (points.length === 0) return [];

  if (isFund) {
    return points.map((p) => ({ time: p.time, value: p.raw }));
  }
  const base = points[0].raw;
  if (base === 0) return [];
  return points.map((p) => ({
    time: p.time,
    value: ((p.raw - base) / base) * 100,
  }));
}

export interface ComparisonIndex {
  key: string;
  label: string;
}

// Resolved against the public search API at request time so identifier
// churn on Nordnet's side doesn't break the chart.
export const COMPARISON_INDEXES: ComparisonIndex[] = [
  { key: "OSEBX", label: "OSEBX (Oslo Børs)" },
  { key: "OMXS30", label: "OMXS30 (Stockholm)" },
  { key: "OMXC25", label: "OMXC25 (København)" },
  { key: "S&P 500", label: "S&P 500" },
];

interface SearchResult {
  entity_type?: string;
  display_name?: string;
  market_data_order_book_id?: string;
}

interface SearchGroup {
  display_group_type: string;
  results: SearchResult[];
}

export async function resolveIndexIdentifier(
  query: string,
): Promise<string | null> {
  const groups = await getJSON<SearchGroup[]>(
    `${NORDNET_API}/main_search?query=${encodeURIComponent(query)}&search_space=ALL&limit=25`,
    legacyApiHeaders,
  );
  if (!groups) return null;

  const indexes: SearchResult[] = [];
  for (const group of groups) {
    for (const r of group.results) {
      if (r.entity_type === "INDEX" && r.market_data_order_book_id) {
        indexes.push(r);
      }
    }
  }
  if (indexes.length === 0) return null;

  // Prefer an index whose name matches the query closely; the raw search
  // often ranks tracker funds above the index itself, so scanning all INDEX
  // hits and picking the best name match beats taking the first one.
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const q = norm(query);
  const exact = indexes.find((r) => norm(r.display_name ?? "") === q);
  if (exact) return exact.market_data_order_book_id!;
  const contains = indexes.find((r) => {
    const n = norm(r.display_name ?? "");
    return n.includes(q) || q.includes(n);
  });
  return (contains ?? indexes[0]).market_data_order_book_id!;
}
