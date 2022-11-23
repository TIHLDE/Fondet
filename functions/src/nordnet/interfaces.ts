export interface NordnetData {
  indexPerformance: Price[];
  fundPerformance: Price[];
  fundPositions: Position[];
}

export interface Price {
  timestamp: number;
  price: number;
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

export interface SharevillePosition {
  percent: number;
  instrument: SharevilleInstrument;
}

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
