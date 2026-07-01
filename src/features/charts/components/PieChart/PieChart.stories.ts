import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { PieChart } from '@/features/charts';
import {
  chartStoryDecorator,
  chartStoryParameters,
} from '@/features/charts/lib/chart-story.decorator';
import { playgroundPieData } from '@/features/charts/lib/chart-story.fixture';

const meta = {
  title: 'Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  decorators: [chartStoryDecorator],
  parameters: chartStoryParameters,
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [...playgroundPieData],
    dataKey: 'value',
    nameKey: 'name',
  },
};

export const Donut: Story = {
  args: {
    data: [...playgroundPieData],
    dataKey: 'value',
    nameKey: 'name',
    innerRadius: 60,
    outerRadius: 90,
  },
};
