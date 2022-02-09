import React, { useRef } from 'react';
import { NordnetData } from 'api';
import { Doughnut } from 'react-chartjs-2';
import { Box } from '@mui/material';
import { _DeepPartialObject } from 'chart.js/types/utils';
import {
  ArcElement,
  Chart,
  Chart as ChartJS,
  ChartData,
  CoreChartOptions,
  DatasetChartOptions,
  DoughnutControllerChartOptions,
  ElementChartOptions,
  Legend,
  PluginChartOptions,
  ScaleChartOptions,
  Title,
  Tooltip,
} from 'chart.js';
import useInView from 'utils/useOnScreen';
import PositionsTable from './PositionsTable';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface PositionsChartProps {
  nordnetData: NordnetData;
}

function generateColorPalette(n: number, a = 1.0): string[] {
  return [...Array(n).keys()].map((i) => (i * 360) / n).map((h) => `hsl(${h}, 73%, 75%, ${a})`);
}

const PositionsChart: React.FC<PositionsChartProps> = ({ nordnetData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'doughnut'>>(null);

  useInView(
    () => {
      const chart = chartRef.current;
      if (chart) {
        chart.data.datasets[0].backgroundColor = generateColorPalette(nordnetData.fundPositions.length, 0.5);
        chart.data.datasets[0].borderColor = generateColorPalette(nordnetData.fundPositions.length);
        chart.data.labels = nordnetData.fundPositions.map((p) => p.name);
        chart.data.datasets[0].data = nordnetData.fundPositions.map((p) => p.percent);
        chart.stop();
        //@ts-expect-error incorrect restriction
        chart.update('in');
      }
    },
    0.5,
    containerRef,
  );

  return (
    <div>
      <Box sx={{ width: '100%', height: { xs: 600, md: 400 } }} ref={containerRef}>
        <Doughnut options={options} data={data} ref={chartRef} />
      </Box>
      <PositionsTable nordnetData={nordnetData} />
    </div>
  );
};

const data: ChartData<'doughnut'> = {
  labels: [],
  datasets: [
    {
      label: 'TIHLDE-Fondet',
      data: [],
    },
  ],
};

const options: _DeepPartialObject<
  CoreChartOptions<'doughnut'> &
    ElementChartOptions<'doughnut'> &
    PluginChartOptions<'doughnut'> &
    DatasetChartOptions<'doughnut'> &
    ScaleChartOptions<'doughnut'> &
    DoughnutControllerChartOptions
> = {
  onResize: (ctx) => {
    const width = window.innerWidth;
    if (width <= 700) {
      ctx.options.plugins!.legend!.position = 'bottom';
      ctx.options.plugins!.legend!.align = 'center';
      ctx.options.font!.size = 12;
      ctx.options.plugins!.legend!.labels!.font!.size = 12;
      //@ts-expect-error wrong
      ctx.options.plugins!.tooltip!.bodyFont!.size = 12;
    } else {
      ctx.options.plugins!.legend!.position = 'right';
      ctx.options.plugins!.legend!.align = 'center';
      ctx.options.font!.size = 14;
      ctx.options.plugins!.legend!.labels!.font!.size = 14;
      //@ts-expect-error wrong
      ctx.options.plugins!.tooltip!.bodyFont!.size = 14;
    }
  },
  plugins: {
    legend: {
      position: 'right',
      align: 'center',
      labels: {
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: {
      bodyFont: {
        size: 12,
      },
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
      },
    },
  },
  elements: {},
  interaction: {},
  transitions: {
    in: {
      animation: {
        duration: 2000,
        easing: 'easeInOutCubic',
      },
    },
  },
  color: 'white',
  borderColor: 'white',
  font: {
    family:
      '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  maintainAspectRatio: false,
  responsive: true,
  rotation: -45,
  cutout: '70%',
  circumference: 360,
  layout: {
    padding: {
      top: 16,
    },
  },
};

export default PositionsChart;
