import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Progress } from '@/features/data-display';

const meta = {
  title: 'Data Display/Progress',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Half: Story = {
  args: { value: 50, max: 100 },
};
