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

const FantasyChart: React.FC<FantasyChartProps> = ({ fantasyfundData, selectedUsers }) => {
  const chartRef = useRef<Chart<'line'>>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const funds =
        selectedUsers.length > 0
          ? Object.values(fantasyfundData.funds)
              .filter((fund) => selectedUsers.includes(fund.profileId)) // Selected users for comparison
              .filter((_, i) => i < 10) // Maximum 10
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
const len = (ctx: ScriptableContext<'line'>) => ctx.chart.data.datasets[ctx.datasetIndex].data.length;
const del = (i: number, length: number) => duration * (i / length) * (0.33 + easing(i / length) / 1.5);
const dur = (i: number, length: number) => del(i + 1, length) - del(i, length);
const prevY = (ctx: ScriptableContext<'line'>) =>
  ctx.chart.scales.y.getPixelForValue((ctx.chart.data.datasets[ctx.datasetIndex].data as ScatterDataPoint[])[ctx.dataIndex - 1].y);
const prevX = (ctx: ScriptableContext<'line'>) =>
  ctx.chart.scales.x.getPixelForValue((ctx.chart.data.datasets[ctx.datasetIndex].data as ScatterDataPoint[])[ctx.dataIndex - 1].x);

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
      chart.options.scales!.x!.ticks!.font = { size: 12 };
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
      chart.options.scales!.x!.ticks!.font = { size: 14 };
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
          return `${date.getDate()}. ${months[date.getMonth()]} ${date.getHours()}:00`;
        },
        label: (ctx) => {
          const label = ctx.dataset.label;
          const value = ctx.parsed.y;
          return `${label}: ${numberFormat.format(value as number)} kr`;
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
          easing: 'linear',
          delay: (ctx) => del(ctx.dataIndex, len(ctx)),
          // @ts-expect-error hack
          from: (ctx) => [ctx.dataIndex > 0 ? prevX(ctx) : NaN, null],
          duration: (ctx) => dur(ctx.dataIndex, len(ctx)),
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
          delay: (ctx) => del(ctx.dataIndex, len(ctx)),
          from: (ctx) => (ctx.dataIndex > 0 ? prevY(ctx) : NaN),
          duration: (ctx) => dur(ctx.dataIndex, len(ctx)),
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
          millisecond: 'HH:mm',
          second: 'HH:mm',
          minute: 'HH:mm',
          hour: 'HH:00',
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
