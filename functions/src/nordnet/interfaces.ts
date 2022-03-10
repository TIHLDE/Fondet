export interface NordnetData {
  //indexInfo: Info;
  indexPerformance: Price[];
  //fundInfo: Info;
  fundPerformance: Price[];
  fundPositions: Position[];
}

export interface Price {
  timestamp: number;
  price: number;
}

export interface Info {
  name: string;
  td?: number;
  w1?: number;
  m1?: number;
  m3?: number;
  m6?: number;
  ty?: number;
  y1?: number;
  y3?: number;
  y5?: number;
}

export interface Position {
  name: string;
  prospectusUrl: string;
  category: string;
  percent: number;
  performanceDay: number;
  performanceWeek: number;
  performanceMonth: number;
  performanceYTD: number;
}

// There are more fields than this
export interface SharevillePosition {
  percent: number;
  instrument: SharevilleInstrument;
}

// There are more fields than this
interface SharevilleInstrument {
  name: string;
  institute: string;
  prospectus_url: string;
  category: string;
  management_fee: number;
  rating: number;
  performance_one_day: number;
  performance_one_week: number;
  performance_one_month: number;
  performance_this_year: number;
  performance_three_years: number;
  performance_five_years: number;
}
