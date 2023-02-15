import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { Position, Price, NordnetData, SharevillePosition } from './interfaces';

const index_name = functions.config().nordnet.index;
const shareville_id = functions.config().nordnet.shareville_id;

// Function is scheduled to run every hour on weekdays.
// Function can be tested locally by running `npm run shell` and calling `updateNordnetData()`.
export const updateNordnetData = functions.pubsub
  .schedule('0 * * * 1-5')
  .timeZone('Europe/Oslo')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .onRun((context) =>
    Promise.all([getIndexPerformance(), getFundPerformance(), getFundPositions()])
      .then(([indexPerformance, fundPerformance, fundPositions]) => {
        const nordnetData: NordnetData = {
          indexPerformance,
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
      })
      .catch((error) => {
        functions.logger.error(error);
      }),
  );

async function getIndexPerformance(): Promise<Price[]> {
  const {
    data: { pricePoints },
  } = await axios.get(`https://api.prod.nntech.io/market-data/price-time-series/v2/period/YEAR_5/identifier/${index_name}?resolution=DAY`, {
    headers: { Origin: 'https://www.shareville.no' },
  });

  const firstPrice: number = pricePoints[0].last;
  const prices: Price[] = pricePoints.map(({ timeStamp, last }: Record<string, number>) => ({
    timestamp: timeStamp,
    price: last / firstPrice,
  }));

  return prices;
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

async function getFundPositions(): Promise<Position[]> {
  const { data: sharevillePositions }: { data: SharevillePosition[] } = await axios.get(
    `https://www.shareville.no/api/v1/portfolios/${shareville_id}/positions`,
  );

  // Total percentage excluding cash position
  const totalPercent = sharevillePositions.reduce((tot, pos) => tot + pos.percent, 0);

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
