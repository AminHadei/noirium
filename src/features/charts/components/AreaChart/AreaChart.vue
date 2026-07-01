<script setup lang="ts">
  import type { EChartsOption } from 'echarts';
  import { computed } from 'vue';
  import VChart from 'vue-echarts';

  import { ECHARTS_GRID_KEY } from '@/features/shared/composables/scan-safe.util';

  import {
    defaultFillColors,
    defaultGridColor,
    defaultStrokeColors,
    defaultTooltipBg,
    defaultTooltipBorder,
    formatValue,
  } from '../../lib/chart-defaults';
  import { registerNoiriumCharts } from '../../lib/register-echarts';
  import type { CategoryChartProps } from '../chart.types';

  defineOptions({
    name: 'NoiriumAreaChart',
    inheritAttrs: false,
  });

  registerNoiriumCharts();

  const GRID_KEY = ECHARTS_GRID_KEY;

  const {
    data,
    index,
    categories,
    strokeColors = defaultStrokeColors,
    fillColors = defaultFillColors,
    tooltipBgColor = defaultTooltipBg,
    tooltipBorderColor = defaultTooltipBorder,
    gridColor = defaultGridColor,
    valueFormatter = formatValue,
    showGrid = true,
    showTooltip = true,
    fill = 'gradient',
  } = defineProps<
    CategoryChartProps & {
      fill?: 'gradient' | 'solid';
    }
  >();

  const option = computed(
    (): EChartsOption => ({
      [GRID_KEY]: { left: 8, right: 24, top: 16, bottom: 8, containLabel: true },
      tooltip: showTooltip
        ? {
            trigger: 'axis',
            backgroundColor: tooltipBgColor,
            borderColor: tooltipBorderColor,
            borderWidth: 2,
            textStyle: { color: 'var(--foreground)' },
            valueFormatter: (value): string => valueFormatter(Number(value)),
          }
        : undefined,
      xAxis: {
        type: 'category',
        data: data.map((row) => String(row[index] ?? '')),
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: showGrid ? { lineStyle: { color: gridColor, type: 'dashed' } } : { show: false },
        axisLabel: { formatter: (value: number): string => valueFormatter(value) },
      },
      series: categories.map((category, seriesIndex) => {
        const color = fillColors[seriesIndex] ?? fillColors[0] ?? 'var(--primary)';
        const stroke = strokeColors[seriesIndex] ?? strokeColors[0] ?? 'var(--foreground)';
        return {
          name: category,
          type: 'line',
          data: data.map((row) => Number(row[category] ?? 0)),
          smooth: false,
          lineStyle: { width: 2, color: stroke },
          itemStyle: { color: stroke },
          areaStyle: {
            color,
            opacity: fill === 'gradient' ? 0.25 : 0.4,
          },
          symbol: 'none',
        };
      }),
    }),
  );
</script>

<template>
  <div
    data-slot="area-chart"
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
