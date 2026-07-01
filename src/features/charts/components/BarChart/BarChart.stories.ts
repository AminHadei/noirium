import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { BarChart } from '@/features/charts';
import {
  chartStoryDecorator,
  chartStoryParameters,
} from '@/features/charts/lib/chart-story.decorator';
import { playgroundChartData } from '@/features/charts/lib/chart-story.fixture';

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  decorators: [chartStoryDecorator],
  parameters: chartStoryParameters,
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [...playgroundChartData],
    index: 'month',
    categories: ['desktop', 'mobile'],
  },
};

export const Stacked: Story = {
  args: {
    data: [...playgroundChartData],
    index: 'month',
    categories: ['desktop', 'mobile'],
    stacked: true,
  },
};

export const Horizontal: Story = {
  args: {
    data: [...playgroundChartData],
    index: 'month',
    categories: ['desktop'],
    alignment: 'horizontal',
  },
};
