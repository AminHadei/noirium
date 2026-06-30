import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Text } from '@/features/data-display';

const meta = {
  title: 'Data Display/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
  args: { as: 'p' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paragraph: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: '<Text v-bind="args">Supporting body text for forms and cards.</Text>',
  }),
};

export const Heading: Story = {
  args: { as: 'h2' },
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: '<Text v-bind="args">Section heading</Text>',
  }),
};
