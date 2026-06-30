import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Textarea } from '@/features/forms';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
