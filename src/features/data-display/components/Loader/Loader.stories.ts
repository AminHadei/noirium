import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Loader } from '@/features/data-display';

const meta = {
  title: 'Data Display/Loader',
  component: Loader,
  tags: ['autodocs'],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
