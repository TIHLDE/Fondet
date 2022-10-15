import { Timestamp } from '@google-cloud/firestore';

export interface FantasyfundUpdateRequest {
  id: number;
}

export interface FantasyfundLeagueResponse {
  success: boolean;
  result: FantasyfundLeagueData;
}

export interface FantasyfundLeagueData {
  name: string;
  funds: FantasyfundFund[];
  ress: Record<number, number>; // { id: return }
}

export interface FantasyfundFund {
  0: number; // id
  1: string; // "-"
  2: boolean; // ?
  3: number; // ?
  4: string; // name
}

export enum CollectionNames {
  FantasyfundData = 'fantasy_fund_data',
  FantasyfundConfig = 'fantasy_fund_config',
}

export interface FantasyFundConfig {
  start: Timestamp;
  end: Timestamp;
  updateScheduleIds: string[];
}

// Firestore collection, document id == FantasyfundFund.id
export interface FantasyfundData {
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

export interface FirebaseConfig {
  databaseURL: string;
  storageBucket: string;
  projectId: string;
}
