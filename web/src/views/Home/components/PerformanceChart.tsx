import React, { useMemo, useState } from 'react';
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
} from 'chart.js';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { NordnetData, Price } from 'api';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Box, Button, ButtonGroup } from '@mui/material';

moment.locale('nb');

ChartJS.register(CategoryScale, LinearScale, TimeScale, TimeSeriesScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PerformanceChartProps {
  nordnetData: NordnetData;
}

enum timescales {
  w1 = 604800000,
  m1 = 2629746000,
  m3 = 3 * 2629746000,
  m6 = 6 * 2629746000,
  ytd = 0,
  y1 = 31556952000,
  y3 = 3 * 31556952000,
  y5 = 5 * 31556952000,
}

const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
//const shortmonths = ['Jan', 'Feb', 'Mars', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];

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

function formatData(nordnetData: NordnetData, timescale: timescales): [number[], number[], number[]] {
  const rawFundData = nordnetData.fundPerformance.map(({ timestamp, price }) => ({ timestamp: roundDate(timestamp), price }));
  const rawIndexData = nordnetData.indexPerformance.map(({ timestamp, price }) => ({ timestamp: roundDate(timestamp), price }));

  const fundMap = priceMap(rawFundData);
  const indexMap = priceMap(rawIndexData);

  const fundDates = new Set([...rawFundData.map(({ timestamp }) => timestamp)]);
  const indexDates = new Set([...rawIndexData.map(({ timestamp }) => timestamp)]);
  const dates = new Set([...fundDates].filter((x) => indexDates.has(x)));

  const startTime = timescale !== timescales.ytd ? Date.now() - timescale : new Date(new Date(Date.now()).setUTCMonth(0, 0)).setUTCHours(0, 0, 0, 0);

  const labels = [...dates].filter((date) => date >= startTime);
  const fundData = normalize(labels.map((date) => fundMap[date]));
  const indexData = normalize(labels.map((date) => indexMap[date]));

  return [labels, fundData, indexData];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ nordnetData }) => {
  const dataTime = 86400000 * nordnetData.fundPerformance.length;

  const timescaleSelections = [
    { scale: timescales.m1, name: '1 måned' },
    ...(dataTime >= timescales.m1 ? [{ scale: timescales.m3, name: '3 måneder' }] : []),
    ...(dataTime >= timescales.m3 ? [{ scale: timescales.m6, name: '6 måneder' }] : []),
    { scale: timescales.ytd, name: 'I år' },
    ...(dataTime >= timescales.m6 ? [{ scale: timescales.y1, name: '1 år' }] : []),
    ...(dataTime >= timescales.y1 ? [{ scale: timescales.y3, name: '3 år' }] : []),
    ...(dataTime >= timescales.y3 ? [{ scale: timescales.y5, name: '5 år' }] : []),
  ];
  const [timescale, setTimescale] = useState<timescales>(timescales.ytd);

  const [labels, fundData, indexData] = useMemo(() => formatData(nordnetData, timescale), [timescale]);

  const data: ChartData<'line'> = {
    labels: labels,
    datasets: [
      {
        label: 'TIHLDE-Fondet',
        data: fundData,
        borderColor: 'rgb(144, 238, 144)',
        backgroundColor: 'rgba(144, 238, 144, 0.5)',
        normalized: true,
      },
      {
        label: 'Hovedindeksen (OSEBX)',
        data: indexData,
        borderColor: 'rgb(173, 216, 230)',
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        normalized: true,
      },
    ],
  };

  const delay = 500.0 / labels.length;

  const options: _DeepPartialObject<
    CoreChartOptions<'line'> &
      ElementChartOptions<'line'> &
      PluginChartOptions<'line'> &
      DatasetChartOptions<'line'> &
      ScaleChartOptions<'line'> &
      LineControllerChartOptions
  > = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        onClick: () => {},
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const date = new Date(items[0].parsed.x);
            return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
          },
          label: (context) => {
            const label = context.dataset.label;
            const value = context.parsed.y;
            return `${label}: ${(value * 100).toFixed(1)}%`;
          },
        },
      },
    },
    elements: {
      line: {
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hoverRadius: 5,
        hoverBorderWidth: 2,
        hitRadius: 0,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animations: {
      x: {
        delay: (context) => context.dataIndex * delay,
        from: (ctx) => ctx.chart.scales.x.getPixelForValue((ctx.chart.data.labels as number[])[ctx.dataIndex]),
      },
      y: {
        delay: (context) => context.dataIndex * delay,
        from: (ctx) => ctx.chart.canvas.height,
      },
    },
    color: 'white',
    borderColor: 'white',
    scales: {
      x: {
        type: 'time',
        grid: {
          display: false,
          color: '#aaa',
          borderColor: '#aaa',
        },
        ticks: {
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

  return (
    <div>
      <Line options={options} data={data} />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <ButtonGroup color='info' sx={{ mt: 2 }}>
          {timescaleSelections.map(({ scale, name }) => (
            <Button key={name} variant={scale === timescale ? 'contained' : 'outlined'} onClick={() => setTimescale(scale)}>
              {name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default PerformanceChart;
