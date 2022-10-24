import React, { useEffect, useRef } from 'react';
import { FantasyfundData } from 'api';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { nb } from 'date-fns/locale';
import {
  CategoryScale,
  Chart,
  Chart as ChartJS,
  ChartData,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  Legend,
  LinearScale,
  LineControllerChartOptions,
  LineElement,
  PluginChartOptions,
  PointElement,
  ScaleChartOptions,
  ScatterDataPoint,
  ScriptableContext,
  Tick,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import annotationPlugin, { LineAnnotationOptions } from 'chartjs-plugin-annotation';
import { easingEffects } from 'chart.js/helpers';
ChartJS.register(CategoryScale, LinearScale, TimeScale, TimeSeriesScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

interface FantasyChartProps {
  fantasyfundData: FantasyfundData;
  selectedUsers: number[];
}

// To test the chart at different amounts of data
/*function moreData(values: FundValue[], n: number) {
  let outValues = [...values];
  const offset = 57600000;
  for (let i = 0; i < n; i++) {
    const newValues = values.map(({ timestamp, value }) => ({
      value: value - 100000 + outValues.at(-1).value,
      timestamp: Timestamp.fromMillis(outValues.at(-1).timestamp.toMillis() + offset + timestamp.toMillis() - values[0].timestamp.toMillis()),
    }));
    outValues = [...outValues, ...newValues];
  }
  return outValues;
}*/

const FantasyChart: React.FC<FantasyChartProps> = ({ fantasyfundData, selectedUsers }) => {
  const chartRef = useRef<Chart<'line'>>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      // @ts-expect-error hack
      chart.allFunds = Object.values(fantasyfundData.funds).map((fund) => ({
        label: fund.name,
        data: fund.values.map((value) => ({ x: value.timestamp.toMillis(), y: value.value })),
      }));

      const funds =
        selectedUsers.length > 0
          ? Object.values(fantasyfundData.funds)
              .filter((fund) => selectedUsers.includes(fund.profileId)) // Selected users for comparison
              .filter((_, i) => i < 10) // Maximum 10
              .sort((a, b) => b.values.at(-1).value - a.values.at(-1).value)
          : Object.values(fantasyfundData.funds)
              .sort((a, b) => b.values.at(-1).value - a.values.at(-1).value)
              .filter((_, i) => i < 5); // Top 5

      const data: ChartData<'line'> = {
        datasets: funds.map((fund, i) => ({
          label: fund.name,
          data: fund.values.map((value) => ({ x: value.timestamp.toMillis(), y: value.value })),
          borderWidth: 2,
          normalized: true,
          borderColor: `rgb(${colors[i]})`,
          backgroundColor: `rgba(${colors[i]}, 0.5)`,
        })),
      };

      chart.data = data;
      chart.options.onResize(chart, { width: chart.width, height: chart.height });
      chart.stop();
      //@ts-expect-error incorrect restriction
      chart.update('in');
    }
  }, [selectedUsers]);

  return (
    <Box sx={{ width: '100%', aspectRatio: '16/9', minHeight: { xs: 400, sm: 350 } }}>
      <Line options={options} data={_data} ref={chartRef} />
    </Box>
  );
};

const _data: ChartData<'line'> = { labels: [], datasets: [] };

const colors = [
  '141, 211, 199',
  '255, 255, 179',
  '190, 186, 218',
  '251, 128, 114',
  '128, 177, 211',
  '253, 180, 98',
  '179, 222, 105',
  '252, 205, 229',
  '217, 217, 217',
  '188, 128, 189',
];

const duration = 4000;
const easing = easingEffects.easeInQuint;
const getDates = (ctx: ScriptableContext<'line'>) => {
  const key = ctx.chart.data.datasets.map((d) => d.label).join('-');
  // @ts-expect-error hack
  ctx.chart.datesMap = ctx.chart.datesMap || new Map();
  // @ts-expect-error hack
  let datesMap = ctx.chart.datesMap.get(key);
  if (!datesMap) {
    // @ts-expect-error hack
    ctx.chart.datesMap.set(key, Array.from(new Set(ctx.chart.data.datasets.flatMap((d) => (d.data as ScatterDataPoint[]).map((p) => p.x)))).sort());
    // @ts-expect-error hack
    datesMap = ctx.chart.datesMap.get(key);
  }
  return datesMap;
};
const idx = (ctx: ScriptableContext<'line'>, dates: number[]) => dates.indexOf(((ctx.dataset.data[ctx.dataIndex] as ScatterDataPoint) || { x: 0 }).x);
const del = (i: number, length: number) => duration * (i / length) * (0.33 + easing(i / length) / 1.5);
const dur = (i: number, length: number) => del(i + 1, length) - del(i, length);
const prevY = (ctx: ScriptableContext<'line'>) => ctx.chart.scales.y.getPixelForValue((ctx.dataset.data as ScatterDataPoint[])[ctx.dataIndex - 1].y);
const prevX = (ctx: ScriptableContext<'line'>) => ctx.chart.scales.x.getPixelForValue((ctx.dataset.data as ScatterDataPoint[])[ctx.dataIndex - 1].x);

const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

const numberFormat = new Intl.NumberFormat('NO', { minimumFractionDigits: 0 });

const options: _DeepPartialObject<
  CoreChartOptions<'line'> &
    ElementChartOptions<'line'> &
    PluginChartOptions<'line'> &
    DatasetChartOptions<'line'> &
    ScaleChartOptions<'line'> &
    LineControllerChartOptions &
    LineAnnotationOptions
> = {
  responsive: true,
  onResize: (chart, { width }) => {
    chart.stop();
    if (width < 600) {
      chart.options.font!.size = 12;
      //@ts-expect-error wrong
      chart.options.plugins!.legend!.labels!.font!.size = 12;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.bodyFont!.size = 12;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.titleFont!.size = 12;
      chart.options.scales!.x!.ticks!.font = (ctx) => ({ size: 12, weight: ctx.tick && ctx.tick.major ? 'bold' : '' });
      chart.options.scales!.y!.ticks!.font = { size: 12 };
      chart.data.datasets.forEach((dataset) => (dataset.borderWidth = 1));
      //@ts-expect-error wrong
      chart.options.plugins.annotation.annotations.zeroLine!.borderDash = [5, 5];
      //@ts-expect-error wrong
      chart.options.plugins.annotation.annotations!.zeroLineInvert!.borderDash = [5, 5];
      //@ts-expect-error wrong
      chart.options.plugins.annotation.annotations!.zeroLineInvert!.borderDashOffset = 5;
    } else {
      chart.options.font!.size = 14;
      //@ts-expect-error wrong
      chart.options.plugins!.legend!.labels!.font!.size = 14;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.bodyFont!.size = 14;
      //@ts-expect-error wrong
      chart.options.plugins!.tooltip!.titleFont!.size = 14;
      chart.options.scales!.x!.ticks!.font = (ctx) => ({ size: 14, weight: ctx.tick && ctx.tick.major ? 'bold' : '' });
      chart.options.scales!.y!.ticks!.font = { size: 14 };
      chart.data.datasets.forEach((dataset) => (dataset.borderWidth = 2));
      //@ts-expect-error wrong
      chart.options.plugins.annotation.annotations!.zeroLine!.borderDash = [8, 8];
      //@ts-expect-error wrong
      chart.options.plugins.annotation.annotations!.zeroLineInvert!.borderDash = [8, 8];
      //@ts-expect-error wrong
      chart.options.plugins.annotation.annotations!.zeroLineInvert!.borderDashOffset = 8;
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { size: 14 },
        generateLabels: (chart) => {
          const data = chart.data;
          if (data.datasets.length) {
            return data.datasets.map((dataset) => {
              const xMax = Math.max(
                // @ts-expect-error hack
                ...(chart.allFunds as { label: string; data: { x: number; y: number }[] }[]).map(({ data }) => data.at(-1).x),
              );
              const position =
                // @ts-expect-error hack
                (chart.allFunds as { label: string; data: { x: number; y: number }[] }[])
                  .filter(({ data }) => data.find((p) => p.x === xMax) !== undefined) // Remove elements without current x value
                  .sort(({ data: a }, { data: b }) => b.find((p) => p.x === xMax).y - a.find((p) => p.x === xMax).y) // Sort by y value on current x value
                  .map(({ label }) => label) // Map to labels
                  .indexOf(dataset.label) + 1; // Grab position

              return {
                text: `${position > 0 ? `${position}. ` : ''}${dataset.label}`,
                fillStyle: dataset.backgroundColor as string,
                strokeStyle: dataset.borderColor as string,
                lineWidth: dataset.borderWidth as number,
              };
            });
          }
          return [];
        },
      },
      maxHeight: 300,
      onClick: (e) => e.native.stopPropagation(),
    },
    annotation: {
      animations: {
        numbers: {
          properties: ['x', 'y', 'x2', 'y2', 'width', 'height', 'radius'],
          type: 'number',
          duration: 0,
          delay: 0,
        },
      },
      annotations: {
        zeroLine: {
          type: 'line',
          borderColor: '#aaa',
          borderDash: [5, 5],
          borderWidth: 1,
          scaleID: 'y',
          value: 100000,
          drawTime: 'beforeDatasetsDraw',
        },
        zeroLineInvert: {
          type: 'line',
          borderColor: '#001328',
          borderDash: [5, 5],
          borderDashOffset: 5,
          borderWidth: 5,
          scaleID: 'y',
          value: 100000,
          drawTime: 'beforeDatasetsDraw',
        },
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
          const hh = String(date.getHours()).padStart(2, '0');
          const mm = String(date.getMinutes()).padStart(2, '0');
          return `${date.getDate()}. ${months[date.getMonth()]} ${hh}:${mm}`;
        },
        label: (ctx) => {
          const xMin = Math.min(
            // @ts-expect-error hack
            ...(ctx.chart.allFunds as { label: string; data: { x: number; y: number }[] }[]).map(({ data }) => data[0].x),
          );

          const x = (ctx.raw as ScatterDataPoint).x;
          const label = ctx.dataset.label;
          const position =
            // @ts-expect-error hack
            (ctx.chart.allFunds as { label: string; data: { x: number; y: number }[] }[])
              .filter(({ data }) => data.find((p) => p.x === x) !== undefined) // Remove elements without current x value
              .sort(({ data: a }, { data: b }) => b.find((p) => p.x === x).y - a.find((p) => p.x === x).y) // Sort by y value on current x value
              .map(({ label }) => label) // Map to labels
              .indexOf(label) + 1; // Grab position
          const value = ctx.parsed.y;
          return `${x !== xMin ? `${position}. ` : ''}${label}: ${numberFormat.format(value)} kr`;
        },
      },
      itemSort: (a, b) => b.parsed.y - a.parsed.y,
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
    mode: 'nearest',
    axis: 'x',
  },
  transitions: {
    in: {
      animations: {
        x: {
          easing: 'linear',
          delay: (ctx) => {
            const dates = getDates(ctx);
            const index = idx(ctx, dates);
            return del(index, dates.length);
          },
          // @ts-expect-error hack
          from: (ctx) => [ctx.dataIndex > 0 ? prevX(ctx) : NaN, null],
          duration: (ctx) => {
            const dates = getDates(ctx);
            const index = idx(ctx, dates);
            return dur(index, dates.length);
          },
          // @ts-expect-error hack
          fn: (start: [number], to: number, factor) => {
            if (!start || !to || !factor) {
              return NaN;
            }
            const [from] = start;
            return to * factor + from * (1 - factor);
          },
        },
        y: {
          easing: 'linear',
          delay: (ctx) => {
            const dates = getDates(ctx);
            const index = idx(ctx, dates);
            return del(index, dates.length);
          },
          from: (ctx) => (ctx.dataIndex > 0 ? prevY(ctx) : NaN),
          duration: (ctx) => {
            const dates = getDates(ctx);
            const index = idx(ctx, dates);
            return dur(index, dates.length);
          },
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
  maintainAspectRatio: false,
  scales: {
    x: {
      adapters: {
        date: {
          locale: nb,
        },
      },
      time: {
        displayFormats: {
          hour: 'HH:mm',
          day: 'd. MMM',
        },
        round: 'minute',
        minUnit: 'hour',
      },
      type: 'timeseries',
      grid: {
        drawOnChartArea: false,
        color: '#aaa',
        borderColor: '#aaa',
      },
      ticks: {
        autoSkipPadding: 16,
        maxRotation: 0,
        color: '#aaa',
        source: 'auto',
        major: {
          enabled: true,
        },
      },
      afterTickToLabelConversion: (axis) => {
        const isTime = (tick: Tick) => /^\d{2}:\d{2}$/.test(tick.label as string);
        const isDay = (tick: Tick) => /^\d{1,2}\. [a-z]{3}(\.|[a-z])$/.test(tick.label as string);
        const isWeekend = (date: Date) => [0, 6].includes(date.getDay());
        const isMarketClosed = (date: Date) => date.getHours() < 9 || date.getHours() > 17;
        const pixelThreshold = 16;

        axis.ticks = axis
          .getTicks()
          .filter((tick) => {
            const date = new Date(tick.value);

            if (isDay(tick) && isWeekend(date)) return false;
            if (isTime(tick) && isMarketClosed(date)) return false;

            return true;
          })
          .filter((_, i, allTicks) => {
            const prev = i > 0 ? { tick: allTicks[i - 1], x: axis.getPixelForTick(i - 1) } : null;
            const x = axis.getPixelForTick(i);
            const next = i < allTicks.length - 1 ? { tick: allTicks[i + 1], x: axis.getPixelForTick(i + 1) } : null;
            if (next?.tick.major && next.x - x < pixelThreshold) return false;
            if (prev?.tick.major && x - prev.x < pixelThreshold) return false;

            return true;
          });
      },
    },
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => `${numberFormat.format(value as number)} kr`,
        color: '#aaa',
      },
      grid: {
        color: '#aaa',
        borderColor: '#aaa',
      },
    },
  },
};

export default FantasyChart;
