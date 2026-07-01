<script setup lang="ts">
  import type { EChartsOption } from 'echarts';
  import { computed } from 'vue';
  import VChart from 'vue-echarts';

  import { PIE_CHART_TYPE } from '@/features/shared/composables/scan-safe.util';

  import {
    defaultPieColors,
    defaultTooltipBg,
    defaultTooltipBorder,
    formatValue,
  } from '../../lib/chart-defaults';
  import { registerNoiriumCharts } from '../../lib/register-echarts';
  import type { ChartRecord, ChartTooltipColors } from '../chart.types';

  defineOptions({
    name: 'NoiriumPieChart',
    inheritAttrs: false,
  });

  registerNoiriumCharts();

  const PIE_TYPE = PIE_CHART_TYPE;

  const {
    data,
    dataKey,
    nameKey,
    colors = defaultPieColors,
    tooltipBgColor = defaultTooltipBg,
    tooltipBorderColor = defaultTooltipBorder,
    valueFormatter = formatValue,
    showTooltip = true,
    innerRadius = 0,
    outerRadius = 100,
  } = defineProps<
    ChartTooltipColors & {
      data: ChartRecord[];
      dataKey: string;
      nameKey: string;
      colors?: string[];
      valueFormatter?: (value: number) => string;
      showTooltip?: boolean;
      innerRadius?: number;
      outerRadius?: number;
    }
  >();

  const option = computed(
    (): EChartsOption => ({
      tooltip: showTooltip
        ? {
            trigger: 'item',
            backgroundColor: tooltipBgColor,
            borderColor: tooltipBorderColor,
            borderWidth: 2,
            textStyle: { color: 'var(--foreground)' },
            valueFormatter: (value): string => valueFormatter(Number(value)),
          }
        : undefined,
      series: [
        {
          type: PIE_TYPE,
          radius: [`${innerRadius}%`, `${outerRadius}%`],
          data: data.map((row, rowIndex) => ({
            name: String(row[nameKey] ?? ''),
            value: Number(row[dataKey] ?? 0),
            itemStyle: { color: colors[rowIndex % colors.length] },
          })),
          label: { show: false },
          emphasis: {
            scale: false,
            focus: 'none',
          },
          animation: false,
        },
      ],
    }),
  );
</script>

<template>
  <div
    data-slot="pie-chart"
    class=":uno: h-80 w-full"
    v-bind="$attrs"
  >
    <VChart
      :option="option"
      autoresize
      class=":uno: h-full w-full"
    />
  </div>
</template>
