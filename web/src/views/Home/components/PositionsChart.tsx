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
    <Box sx={{ width: '100%', height: { xs: 600, md: 400 } }} ref={containerRef}>
      <Doughnut options={options} data={data} ref={chartRef} />
    </Box>
  );
};

const data: ChartData<'doughnut'> = {
  labels: [],
  datasets: [
    {
      label: 'TIHLDE-Fondet',
      data: [],
      hoverBorderWidth: 3,
      borderWidth: 2,
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
      maxWidth: 1000,
      maxHeight: 1000,
      labels: {
        padding: 16,
        font: { size: 12 },
        generateLabels: (chart) => {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return (data.labels as string[]).map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i, false);
              const value = data.datasets[0].data[i] as number;

              return {
                text: `${label}: ${value.toFixed(1)}%`,
                fillStyle: style.backgroundColor as string,
                strokeStyle: style.borderColor as string,
                lineWidth: style.borderWidth as number,
                hidden: !chart.getDataVisibility(i),
                datasetIndex: 0,
                index: i,
              };
            });
          }
          return [];
        },
      },
      onClick(e, legendItem, legend) {
        //@ts-expect-error incorrect
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      },
    },
    tooltip: {
      bodyFont: {
        size: 12,
      },
      multiKeyBackground: 'rgba(0,0,0,0.8)',
      boxPadding: 4,
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
      },
    },
  },
  transitions: {
    in: {
      animation: {
        duration: 2000,
        easing: 'easeInOutCubic',
      },
      animations: {
        x: { duration: 0 },
        y: { duration: 0 },
        outerRadius: { duration: 0 },
        innerRadius: { duration: 0 },
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
