export type ChartRecord = Record<string, string | number>;

export interface ChartTooltipColors {
  tooltipBgColor?: string;
  tooltipBorderColor?: string;
}

export interface CategoryChartProps extends ChartTooltipColors {
  data: ChartRecord[];
  index: string;
  categories: string[];
  strokeColors?: string[];
  fillColors?: string[];
  gridColor?: string;
  valueFormatter?: (value: number) => string;
  showGrid?: boolean;
  showTooltip?: boolean;
  class?: string;
}
