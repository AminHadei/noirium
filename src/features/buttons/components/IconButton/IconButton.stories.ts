import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { IconButton } from '@/features/buttons';

const variantOptions = ['primary', 'outline', 'text'] as const;
const sizeOptions = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [...variantOptions],
    },
    size: {
      control: 'select',
      options: [...sizeOptions],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const iconButtonTemplate = `
  <IconButton v-bind="args">
    <span class=":uno: i-search size-5" />
  </IconButton>
`;

export const Primary: Story = {
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args }),
    template: iconButtonTemplate,
  }),
};

export const Outline: Story = {
  args: { variant: 'outline' },
  render: Primary.render,
};

export const Text: Story = {
  args: { variant: 'text' },
  render: Primary.render,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Primary.render,
};

export const Variants: Story = {
  render: () => ({
    components: { IconButton },
    template: `
      <div class=":uno: flex items-center gap-4">
        <IconButton variant="primary"><span class=":uno: i-search size-5" /></IconButton>
        <IconButton variant="outline"><span class=":uno: i-search size-5" /></IconButton>
        <IconButton variant="text"><span class=":uno: i-search size-5" /></IconButton>
      </div>
    `,
  }),
};
