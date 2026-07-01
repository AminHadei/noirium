import type { EChartsOption } from 'echarts';

import type { ChartRecord } from '../components/chart.types';

interface AxisConfig {
  index: string;
  data: ChartRecord[];
  gridColor: string;
  showGrid: boolean;
  horizontal: boolean;
  valueFormatter: (value: number) => string;
}

export const buildChartAxes = ({
  index,
  data,
  gridColor,
  showGrid,
  horizontal,
  valueFormatter,
}: AxisConfig): Pick<EChartsOption, 'xAxis' | 'yAxis'> => {
  const categoryAxis = {
    type: 'category' as const,
    data: data.map((row: ChartRecord) => String(row[index] ?? '')),
    axisLine: { show: false },
    axisTick: { show: false },
  };
  const valueAxis = {
    type: 'value' as const,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { formatter: (value: number): string => valueFormatter(value) },
  };
  const splitLine = showGrid
    ? { lineStyle: { color: gridColor, type: 'dashed' as const } }
    : { show: false };

  return {
    xAxis: horizontal ? { ...valueAxis, splitLine } : categoryAxis,
    yAxis: horizontal ? { ...categoryAxis, inverse: true } : { ...valueAxis, splitLine },
  };
};

interface SeriesConfig {
  data: ChartRecord[];
  categories: string[];
  strokeColors: string[];
  fillColors: string[];
  stacked: boolean;
}

export const buildBarSeries = ({
  data,
  categories,
  strokeColors,
  fillColors,
  stacked,
}: SeriesConfig): EChartsOption['series'] =>
  categories.map((category: string, seriesIndex: number) => ({
    name: category,
    type: 'bar' as const,
    stack: stacked ? 'total' : undefined,
    data: data.map((row: ChartRecord) => Number(row[category] ?? 0)),
    itemStyle: {
      color: fillColors[seriesIndex] ?? fillColors[0],
      borderColor: strokeColors[seriesIndex] ?? strokeColors[0],
      borderWidth: 1,
    },
  }));
