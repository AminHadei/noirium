import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { IconButton } from '@/features/buttons';

const meta = {
  title: 'Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'outline', 'text'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args }),
    template: `
      <IconButton v-bind="args">
        <span class="i-search size-5" />
      </IconButton>
    `,
  }),
};

export const Outline: Story = {
  args: { variant: 'outline' },
  render: Primary.render,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Primary.render,
};
