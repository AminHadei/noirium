import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Switch } from '@/features/forms';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
