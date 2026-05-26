import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { BaseBadge } from '@/features/shared';

const colorOptions = ['red', 'green', 'white', 'gray', 'black', 'custom'] as const;

const meta = {
  title: 'Shared UI/BaseBadge',
  component: BaseBadge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [...colorOptions],
      description: 'Preset or custom badge palette',
    },
    customBackground: {
      control: 'color',
      description: 'Background when color is custom',
    },
    customText: {
      control: 'color',
      description: 'Label color when color is custom',
    },
  },
  args: {
    color: 'red',
  },
} satisfies Meta<typeof BaseBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Red: Story = {
  args: {
    color: 'red',
  },
  render: (args): object => ({
    components: {
      BaseBadge,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<BaseBadge v-bind="args">Overdue</BaseBadge>',
  }),
};

export const Green: Story = {
  args: {
    color: 'green',
  },
  render: (args): object => ({
    components: {
      BaseBadge,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<BaseBadge v-bind="args">Active</BaseBadge>',
  }),
};

export const Neutral: Story = {
  render: () => ({
    components: {
      BaseBadge,
    },
    template: `
      <div style="display: flex; gap: 0.75rem; align-items: center; padding: 1rem; background: #f5f5f5;">
        <BaseBadge color="white">White</BaseBadge>
        <BaseBadge color="gray">Gray</BaseBadge>
        <BaseBadge color="black">Black</BaseBadge>
      </div>
    `,
  }),
};

export const Custom: Story = {
  args: {
    color: 'custom',
    customBackground: '#EDE9FE',
    customText: '#5B21B6',
  },
  render: (args): object => ({
    components: {
      BaseBadge,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<BaseBadge v-bind="args">Enterprise</BaseBadge>',
  }),
};

export const AllColors: Story = {
  render: () => ({
    components: {
      BaseBadge,
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; padding: 1rem; background: #f5f5f5;">
        <BaseBadge color="red">Overdue</BaseBadge>
        <BaseBadge color="green">Active</BaseBadge>
        <BaseBadge color="white">White</BaseBadge>
        <BaseBadge color="gray">Gray</BaseBadge>
        <BaseBadge color="black">Black</BaseBadge>
        <BaseBadge color="custom" custom-background="#FFEDD5" custom-text="#9A3412">Custom</BaseBadge>
      </div>
    `,
  }),
};

export const WithDifferentContent: Story = {
  render: () => ({
    components: {
      BaseBadge,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <BaseBadge color="red">Error</BaseBadge>
          <BaseBadge color="red">Failed</BaseBadge>
          <BaseBadge color="red">Cancelled</BaseBadge>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <BaseBadge color="green">Success</BaseBadge>
          <BaseBadge color="green">Completed</BaseBadge>
          <BaseBadge color="green">Approved</BaseBadge>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <BaseBadge color="gray">Draft</BaseBadge>
          <BaseBadge color="black">Featured</BaseBadge>
        </div>
      </div>
    `,
  }),
};
