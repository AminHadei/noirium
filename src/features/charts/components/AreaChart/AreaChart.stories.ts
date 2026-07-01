import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { AreaChart } from '@/features/charts';
import {
  chartStoryDecorator,
  chartStoryParameters,
} from '@/features/charts/lib/chart-story.decorator';
import { playgroundChartData } from '@/features/charts/lib/chart-story.fixture';

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  decorators: [chartStoryDecorator],
  parameters: chartStoryParameters,
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [...playgroundChartData],
    index: 'month',
    categories: ['desktop', 'mobile'],
    fill: 'gradient',
  },
};
