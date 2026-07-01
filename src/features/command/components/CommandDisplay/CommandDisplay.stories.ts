import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { CommandDisplay } from '@/features/command';

const meta = {
  title: 'Command/CommandDisplay',
  component: CommandDisplay,
  tags: ['autodocs'],
  args: {
    command: 'npm install noirium',
  },
} satisfies Meta<typeof CommandDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pnpm: Story = {
  args: {
    command: 'pnpm add noirium',
  },
};
