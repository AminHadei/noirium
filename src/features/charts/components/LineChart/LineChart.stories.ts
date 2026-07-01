import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { LineChart } from '@/features/charts';
import {
  chartStoryDecorator,
  chartStoryParameters,
} from '@/features/charts/lib/chart-story.decorator';
import { playgroundChartData } from '@/features/charts/lib/chart-story.fixture';

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  decorators: [chartStoryDecorator],
  parameters: chartStoryParameters,
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [...playgroundChartData],
    index: 'month',
    categories: ['desktop', 'mobile'],
    smooth: true,
  },
};

export const Linear: Story = {
  args: {
    data: [...playgroundChartData],
    index: 'month',
    categories: ['desktop', 'mobile'],
    smooth: false,
  },
};
