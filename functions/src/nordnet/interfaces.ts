export interface NordnetData {
  indexInfo: Info;
  indexPerformance: Price[];
  fundInfo: Info;
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
