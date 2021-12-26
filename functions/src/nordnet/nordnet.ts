import { Request, Response } from 'express';
import { HttpFunction } from '@google-cloud/functions-framework';
import axios from 'axios';
//import { Storage } from '@google-cloud/storage';
import { Info, Position, Price, NordnetData } from './interfaces';

//const storage = new Storage({ keyFile: 'key.json' });

export const updateNordnetData: HttpFunction = (_: Request, res: Response) => {
  nordnetLogin()
    .then((session_id) =>
      Promise.all([getIndexInfo(session_id), getIndexPerformance(session_id), getFundInfo(), getFundPerformance(), getFundPositions()]).then(
        ([indexInfo, indexPerformance, fundInfo, fundPerformance, fundPositions]) => {
          const nordnetData: NordnetData = {
            indexInfo,
            indexPerformance,
            fundInfo,
            fundPerformance,
            fundPositions,
          };

          //storage.bucket('data').file('nordnet.json').save(JSON.stringify(nordnetData), { public: true });
          console.log('Updated data from Nordnet.');
          res.status(200).send(nordnetData);
        },
      ),
    )
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
};

async function nordnetLogin(): Promise<string> {
  const {
    data: { session_id },
  } = await axios.post('https://www.nordnet.no/api/2/login/anonymous');

  return session_id;
}

async function getIndexPerformance(session_id: string): Promise<Price[]> {
  const today = new Date(Date.now());

  const {
    data: { 0: index },
  } = await axios.get(`https://www.nordnet.no/api/2/indicators/historical/values/${process.env.NORDNET_INDEX}`, {
    headers: {
      Cookie: `NOW=${session_id}`,
    },
    params: {
      from: `${today.getFullYear() - 5}-${today.getMonth()}-${today.getDate()}`,
      to: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    },
  });

  const firstPrice = index.prices[0].last;
  const prices: Price[] = index.prices.map(({ time, last }: { time: number; last: number }) => ({
    timestamp: time / 1000,
    price: last / firstPrice,
  }));

  return prices;
}

async function getIndexInfo(session_id: string) {
  const {
    data: { 0: r },
  } = await axios.get(`https://www.nordnet.no/api/2/indicators/historical/returns/${process.env.NORDNET_INDEX}`, {
    headers: {
      Cookie: `NOW=${session_id}`,
    },
  });

  const info: Info = {
    name: process.env.NORDNET_INDEX ?? 'INDEKS',
    td: r.td ?? 0,
    w1: r.w1 ?? 0,
    m1: r.m1,
    m3: r.m3,
    m6: r.m6,
    ty: r.ty,
    y1: r.y1,
    y3: r.y3,
    y5: r.y5,
  };

  return info;
}

async function getFundPerformance(): Promise<Price[]> {
  const {
    data: { y5 },
  } = await axios.get(`https://www.shareville.no/api/v1/portfolios/${process.env.SHAREVILLE_ID}/performance`);

  const firstPrice = y5[0].value;
  const prices: Price[] = y5.map(({ date, value }: { date: string; value: number }) => ({
    timestamp: new Date(date).getTime() / 1000,
    price: value / firstPrice,
  }));

  return prices;
}

async function getFundInfo(): Promise<Info> {
  const { data: r } = await axios.get(`https://www.shareville.no/api/v1/portfolios/${process.env.SHAREVILLE_ID}`);

  const info: Info = {
    name: 'TIHLDE-Fondet',
    td: r.st ?? 0,
    w1: r.w1 ?? 0,
    m1: r.m1,
    m3: r.m3,
    m6: r.m6,
    ty: r.ty,
    y1: r.y1,
    y3: r.y3,
  };

  return info;
}

async function getFundPositions(): Promise<Position[]> {
  const { data } = await axios.get(`https://www.shareville.no/api/v1/portfolios/${process.env.SHAREVILLE_ID}/positions`);

  const positions: Position[] = data.map((pos: Record<string, Record<string, unknown>>) => ({
    percent: pos.percent,
    name: pos.instrument.name,
    prospecturUrl: pos.instrument.prospectus_url,
    category: pos.instrument.category,
    performanceDay: pos.instrument.performance_one_day,
    performanceWeek: pos.instrument.performance_one_week,
    performanceMonth: pos.instrument.performance_one_month,
    performanceYTD: pos.instrument.performance_this_year,
  }));

  return positions;
}
