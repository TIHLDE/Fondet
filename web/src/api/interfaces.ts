import { Timestamp } from 'firebase/firestore';

export interface Application {
  applicant: string;
  purpose: string;
  dateReceived: string;
  approved: string;
  requestedSum: string;
  approvedSum: string;
  applicationUrl: string;
  decisionUrl: string;
}

export interface Member {
  name: string;
  title: string;
  imageUrl: string;
  year?: string;
}

export interface SheetsData {
  previousApplications: Application[];
  currentMembers: Member[];
  previousMembers: Record<string, Member[]>;
}

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

export interface FantasyfundData {
  id: string;
  name: string;
  start: Timestamp;
  end: Timestamp;
  lastUpdated: Timestamp;
  funds: Record<number, Fund>; // { id: fund }
}

export interface Fund {
  name: string;
  values: FundValue[];
}

export interface FundValue {
  timestamp: Timestamp;
  value: number;
}

export enum CollectionNames {
  FantasyfundData = 'fantasy_fund_data',
}
