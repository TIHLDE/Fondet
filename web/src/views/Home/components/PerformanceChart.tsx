import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  CoreChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  ElementChartOptions,
  LineControllerChartOptions,
  Chart,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { nb } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import { NordnetData, Price } from 'api';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
ChartJS.register(CategoryScale, LinearScale, TimeScale, TimeSeriesScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PerformanceChartProps {
  nordnetData: NordnetData;
}

type TimeSelection = {
  scale: timescales;
  name: string;
};

type DataMap = Record<number, [number[], number[], number[]]>;

enum timescales {
  w1,
  m1,
  m3,
  m6,
  ytd,
  y1,
  y3,
  y5,
}

const startTimes: Record<timescales, number> = {
  [timescales.w1]: subtractNow({ weeks: 1 }),
  [timescales.m1]: subtractNow({ months: 1 }),
  [timescales.m3]: subtractNow({ months: 3 }),
  [timescales.m6]: subtractNow({ months: 6 }),
  [timescales.ytd]: getStartOfYear(),
  [timescales.y1]: subtractNow({ years: 1 }),
  [timescales.y3]: subtractNow({ years: 3 }),
  [timescales.y5]: subtractNow({ years: 5 }),
};

const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

function subtractNow({ weeks = 0, months = 0, years = 0 }: { weeks?: number; months?: number; years?: number }): number {
  const now = new Date(Date.now());
  now.setUTCHours(0, 0, 0, 0);
  now.setUTCFullYear(now.getUTCFullYear() - years, now.getUTCMonth() - months, now.getUTCDate() - 7 * weeks);
  return now.getTime();
}

function getStartOfYear(): number {
  const now = new Date(Date.now());
  now.setUTCMonth(0, 1);
  now.setUTCHours(0, 0, 0, 0);
  return now.getTime();
}

function roundDate(utcDate: number): number {
  const date = new Date(utcDate);
  return date.setUTCHours(0, 0, 0, 0);
}

function normalize(prices: number[]): number[] {
  const firstPrice = prices[0];
  return prices.map((price) => price / firstPrice - 1);
}

function priceMap(performance: Price[]): Record<number, number> {
  return performance.reduce((map: Record<number, number>, price: Price) => {
    map[price.timestamp] = price.price;
    return map;
  }, {});
}

function interpolatePrice(priceMap: Record<number, number>): Record<number, number> {
  const dates = Object.keys(priceMap).map((k) => parseInt(k));
  const startDate = Math.min(...dates);
  const endDate = Math.max(...dates);

  const newPriceMap: Record<number, number> = {};

  const date = new Date(startDate);
  let lastPrice = 0;
  while (date.getTime() <= endDate) {
    const dateUtc = date.getTime();
    if (priceMap[dateUtc]) {
      lastPrice = priceMap[dateUtc];
      newPriceMap[dateUtc] = lastPrice;
    } else {
      newPriceMap[dateUtc] = lastPrice;
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return newPriceMap;
}

function formatData(nordnetData: NordnetData, timescale: timescales): [number[], number[], number[]] {
  const rawFundData = nordnetData.fundPerformance.map(({ timestamp, price }) => ({ timestamp: roundDate(timestamp), price }));
  const rawIndexData = nordnetData.indexPerformance.map(({ timestamp, price }) => ({ timestamp: roundDate(timestamp), price }));

  let fundMap = priceMap(rawFundData);
  fundMap = interpolatePrice(fundMap);
  let indexMap = priceMap(rawIndexData);
  indexMap = interpolatePrice(indexMap);

  const labels = Object.keys(fundMap)
    .map((k) => parseInt(k))
    .filter((date) => date >= startTimes[timescale]);

  const fundData = normalize(labels.map((date) => fundMap[date]));
  const indexData = normalize(labels.map((date) => indexMap[date]));

  return [labels, fundData, indexData];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ nordnetData }) => {
  const startTime = nordnetData.fundPerformance[0].timestamp;

  const timescaleSelections: TimeSelection[] = [
    { scale: timescales.m1, name: '1 md.' },
    ...(startTime < startTimes[timescales.m1] ? [{ scale: timescales.m3, name: '3 md.' }] : []),
    ...(startTime < startTimes[timescales.m3] ? [{ scale: timescales.m6, name: '6 md.' }] : []),
    { scale: timescales.ytd, name: 'I ??r' },
    ...(startTime < startTimes[timescales.m6] ? [{ scale: timescales.y1, name: '1 ??r' }] : []),
    ...(startTime < startTimes[timescales.y1] ? [{ scale: timescales.y3, name: '3 ??r' }] : []),
    ...(startTime < startTimes[timescales.y3] ? [{ scale: timescales.y5, name: '5 ??r' }] : []),
  ];

  const [timescale, setTimescale] = useState<timescales>(timescales.ytd);
  const [fundReturn, setFundReturn] = useState<number>();

  const chartRef = useRef<Chart<'line'>>(null);

  const dataScales = useMemo(
    () =>
      timescaleSelections.reduce(function (map: DataMap, { scale }: TimeSelection): DataMap {
        map[scale] = formatData(nordnetData, scale);
        return map;
      }, {}),
    [],
  );

  function setData(timescale: timescales) {
    const [labels, fundData, indexData] = dataScales[timescale];

    const chart = chartRef.current;
    if (chart) {
      setTimeout(() => {
        chart.data.labels = labels;
        chart.data.datasets[0].data = fundData;
        chart.data.datasets[1].data = indexData;

        chart.stop();
        //@ts-expect-error incorrect restriction
        chart.update('in');
      }, 10);
    }
    setFundReturn(fundData[fundData.length - 1]);
  }

  useEffect(() => setData(timescale), [timescale]);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', color: '#ddd', mt: -6.8 }}>
        <Typography variant='h2' sx={{ mt: 0, color: fundReturn ? (fundReturn > 0 ? 'lightgreen' : 'lightcoral') : '#ddd' }}>
          {fundReturn !== null && fundReturn > 0 ? '+' : ''}
          {fundReturn !== null ? `${(fundReturn * 100).toFixed(1)}%` : ''}
        </Typography>
      </Box>
      <Box sx={{ width: '100%', aspectRatio: '16/9' }}>
        <Line options={options} data={data} ref={chartRef} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <ButtonGroup color='info' sx={{ mt: 2 }}>
          {timescaleSelections.map(({ scale, name }) => (
            <Button
              key={name}
              sx={{ fontSize: { xs: 12, sm: 13, md: 14 }, px: { xs: 1, sm: 1.3, md: 2 } }}
              variant={scale === timescale ? 'contained' : 'outlined'}
              onClick={() => setTimescale(scale)}>
              {name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </div>
  );
};

const data: ChartData<'line'> = {
  labels: [],
  datasets: [
    {
      label: 'TIHLDE-Fondet',
      data: [],
      borderColor: 'rgb(144, 238, 144)',
      backgroundColor: 'rgba(144, 238, 144, 0.5)',
      borderWidth: 2,
      normalized: true,
    },
    {
      label: 'Hovedindeksen (OSEBX)',
      data: [],
      borderColor: 'rgb(173, 216, 230)',
      backgroundColor: 'rgba(173, 216, 230, 0.5)',
      borderWidth: 2,
      normalized: true,
    },
  ],
};

const duration = 500;
const delay = 1500;

const options: _DeepPartialObject<
  CoreChartOptions<'line'> &
    ElementChartOptions<'line'> &
    PluginChartOptions<'line'> &
    DatasetChartOptions<'line'> &
    ScaleChartOptions<'line'> &
    LineControllerChartOptions
> = {
  responsive: true,
  onResize: (chart, { width }) => {
    if (width < 600) {
      chart.options.font!.size = 12;
      chart.options.plugins!.legend!.labels!.font!.size = 12;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.bodyFont!.size = 12;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.titleFont!.size = 12;
      chart.options.scales!.x!.ticks!.font = { size: 12 };
      chart.options.scales!.y!.ticks!.font = { size: 12 };
      chart.data.datasets[0].borderWidth = 1;
      chart.data.datasets[1].borderWidth = 1;
    } else {
      chart.options.font!.size = 14;
      chart.options.plugins!.legend!.labels!.font!.size = 14;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.bodyFont!.size = 14;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.titleFont!.size = 14;
      chart.options.scales!.x!.ticks!.font = { size: 14 };
      chart.options.scales!.y!.ticks!.font = { size: 14 };
      chart.data.datasets[0].borderWidth = 2;
      chart.data.datasets[1].borderWidth = 2;
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { size: 14 },
      },
    },
    tooltip: {
      multiKeyBackground: 'rgba(0,0,0,0.8)',
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 14,
      },
      boxPadding: 4,
      callbacks: {
        title: (items) => {
          const date = new Date(items[0].parsed.x);
          return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
        },
        label: (ctx) => {
          const label = ctx.dataset.label;
          const value = ctx.parsed.y;
          return `${label}: ${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
        },
      },
    },
  },
  elements: {
    line: {
      borderCapStyle: 'round',
      borderJoinStyle: 'round',
    },
    point: {
      radius: 0,
      hoverRadius: 5,
      hoverBorderWidth: 2,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  transitions: {
    in: {
      animations: {
        x: {
          easing: 'easeOutCubic',
          delay: (ctx) => (ctx.dataIndex * delay) / (ctx.chart.data.labels as number[]).length,
          from: (ctx) => ctx.chart.scales.x.getPixelForValue((ctx.chart.data.labels as number[])[ctx.dataIndex]),
          duration,
        },
        y: {
          easing: 'easeOutCubic',
          delay: (ctx) => (ctx.dataIndex * delay) / (ctx.chart.data.labels as number[]).length,
          from: (ctx) => ctx.chart.canvas.height,
          duration,
        },
      },
    },
  },
  color: 'white',
  font: {
    family:
      '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    size: 14,
  },
  borderColor: 'white',
  aspectRatio: 16 / 9,
  scales: {
    x: {
      adapters: {
        date: {
          locale: nb,
        },
      },
      type: 'time',
      grid: {
        drawOnChartArea: false,
        color: '#aaa',
        borderColor: '#aaa',
      },
      ticks: {
        autoSkipPadding: 16,
        maxRotation: 0,
        color: '#aaa',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${((value as number) * 100).toFixed(1)}%`,
        color: '#aaa',
      },
      grid: {
        color: '#aaa',
        borderColor: '#aaa',
      },
    },
  },
};

export default PerformanceChart;
