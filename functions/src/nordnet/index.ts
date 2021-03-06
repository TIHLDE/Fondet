import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { Info, Position, Price, NordnetData, SharevillePosition } from './interfaces';

const index_name = functions.config().nordnet.index;
const shareville_id = functions.config().nordnet.shareville_id;

// Function is scheduled to run every hour on weekdays.
// Function can be tested locally by running `npm run shell` and calling `updateNordnetData()`.
export const updateNordnetData = functions.pubsub
  .schedule('0 * * * 1-5')
  .timeZone('Europe/Oslo')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .onRun((context) =>
    nordnetLogin()
      .then((session_id) =>
        Promise.all([/*getIndexInfo(session_id),*/ getIndexPerformance(session_id), /*getFundInfo(),*/ getFundPerformance(), getFundPositions()]).then(
          ([/*indexInfo,*/ indexPerformance, /*fundInfo,*/ fundPerformance, fundPositions]) => {
            const nordnetData: NordnetData = {
              //indexInfo,
              indexPerformance,
              //fundInfo,
              fundPerformance,
              fundPositions,
            };

            return admin
              .storage()
              .bucket()
              .file('database/nordnet.json')
              .save(JSON.stringify(nordnetData), {
                gzip: true,
                contentType: 'application/json',
              })
              .then(() => {
                functions.logger.info('Updated data from Nordnet.');
              });
          },
        ),
      )
      .catch((error) => {
        functions.logger.error(error);
      }),
  );

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
  } = await axios.get(`https://www.nordnet.no/api/2/indicators/historical/values/${index_name}`, {
    headers: {
      Cookie: `NOW=${session_id}`,
    },
    params: {
      from: `${today.getFullYear() - 5}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,

      to: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    },
  });

  const firstPrice = index.prices[0].last;
  const prices: Price[] = index.prices.map(({ time, last }: { time: number; last: number }) => ({
    timestamp: time,
    price: last / firstPrice,
  }));

  return prices;
}

// Not used for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getIndexInfo(session_id: string) {
  const {
    data: { 0: r },
  } = await axios.get(`https://www.nordnet.no/api/2/indicators/historical/returns/${index_name}`, {
    headers: {
      Cookie: `NOW=${session_id}`,
    },
  });

  const info: Info = {
    name: index_name,
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
  } = await axios.get(`https://www.shareville.no/api/v1/portfolios/${shareville_id}/performance`);

  const firstPrice = y5[0].value;
  const prices: Price[] = y5.map(({ date, value }: { date: string; value: number }) => ({
    timestamp: new Date(date).getTime(),
    price: value / firstPrice,
  }));

  return prices;
}

// Not used for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getFundInfo(): Promise<Info> {
  const { data: r } = await axios.get(`https://www.shareville.no/api/v1/portfolios/${shareville_id}`);

  const info: Info = {
    name: 'TIHLDE-Fondet',
    w1: r.w1 ? parseFloat(r.w1) : undefined,
    m1: r.m1 ? parseFloat(r.m1) : undefined,
    m3: r.m3 ? parseFloat(r.m3) : undefined,
    m6: r.m6 ? parseFloat(r.m6) : undefined,
    ty: r.ty ? parseFloat(r.ty) : undefined,
    y1: r.y1 ? parseFloat(r.y1) : undefined,
    y3: r.y3 ? parseFloat(r.y3) : undefined,
  };

  return info;
}

async function getFundPositions(): Promise<Position[]> {
  const { data: sharevillePositions }: { data: SharevillePosition[] } = await axios.get(
    `https://www.shareville.no/api/v1/portfolios/${shareville_id}/positions`,
  );

  const totalPercent = sharevillePositions.reduce((tot, pos) => tot + pos.percent, 0); // Total percentage excluding cash position

  const positions: Position[] = sharevillePositions.map((pos) => ({
    percent: (100 * pos.percent) / totalPercent,
    name: pos.instrument.name,
    prospectusUrl: pos.instrument.prospectus_url,
    category: pos.instrument.category,
    performanceDay: pos.instrument.performance_one_day,
    performanceWeek: pos.instrument.performance_one_week,
    performanceMonth: pos.instrument.performance_one_month,
    performanceYTD: pos.instrument.performance_this_year,
  }));

  return positions;
}
