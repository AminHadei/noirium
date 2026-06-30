import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Slider } from '@/features/forms';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { modelValue: 40 },
};
