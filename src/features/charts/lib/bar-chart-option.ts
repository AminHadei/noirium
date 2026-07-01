import type { EChartsOption } from 'echarts';

import { ECHARTS_GRID_KEY } from '@/features/shared/composables/scan-safe.util';

import type { CategoryChartProps } from '../components/chart.types';
import { buildBarSeries, buildChartAxes } from './chart-axis.util';

export interface BarChartOptions extends CategoryChartProps {
  stacked?: boolean;
  alignment?: 'vertical' | 'horizontal';
}

const buildBarTooltip = (
  showTooltip: boolean,
  tooltipBgColor: string,
  tooltipBorderColor: string,
  valueFormatter: (value: number) => string,
): EChartsOption['tooltip'] =>
  showTooltip
    ? {
        trigger: 'axis',
        backgroundColor: tooltipBgColor,
        borderColor: tooltipBorderColor,
        borderWidth: 2,
        textStyle: { color: 'var(--foreground)' },
        valueFormatter: (value): string => valueFormatter(Number(value)),
      }
    : undefined;

const GRID_KEY = ECHARTS_GRID_KEY;

export const buildBarChartOption = ({
  data,
  index,
  categories,
  strokeColors,
  fillColors,
  tooltipBgColor,
  tooltipBorderColor,
  gridColor,
  valueFormatter,
  showGrid,
  showTooltip,
  stacked,
  alignment,
}: Required<
  Pick<
    BarChartOptions,
    | 'data'
    | 'index'
    | 'categories'
    | 'strokeColors'
    | 'fillColors'
    | 'tooltipBgColor'
    | 'tooltipBorderColor'
    | 'gridColor'
    | 'valueFormatter'
    | 'showGrid'
    | 'showTooltip'
    | 'stacked'
    | 'alignment'
  >
>): EChartsOption => ({
  [GRID_KEY]: { left: 8, right: 24, top: 16, bottom: 8, containLabel: true },
  tooltip: buildBarTooltip(showTooltip, tooltipBgColor, tooltipBorderColor, valueFormatter),
  ...buildChartAxes({
    index,
    data,
    gridColor,
    showGrid,
    horizontal: alignment === 'horizontal',
    valueFormatter,
  }),
  series: buildBarSeries({ data, categories, strokeColors, fillColors, stacked }),
});
