import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

let registered = false;

/** Registers the ECharts modules used by Noirium chart components (idempotent). */
export const registerNoiriumCharts = (): void => {
  if (registered) return;
  use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
  ]);
  registered = true;
};
