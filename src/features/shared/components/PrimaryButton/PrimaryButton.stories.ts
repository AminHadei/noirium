import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';

import { PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Shared UI/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'text'],
      description: 'The visual style variant of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner instead of chevron',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and reduces opacity',
    },
    showChevron: {
      control: 'boolean',
      description: 'Shows or hides the chevron icon',
    },
    href: {
      control: 'text',
      description: 'If provided, renders as an anchor tag',
    },
    to: {
      control: 'text',
      description: 'If provided, renders as a nuxt-link (for routing)',
    },
  },
  args: {
    variant: 'primary',
    loading: false,
    disabled: false,
    showChevron: true,
    onClick: fn(),
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args): object => ({
    components: {
      PrimaryButton,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<PrimaryButton v-bind="args">Get Started</PrimaryButton>',
  }),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (args): object => ({
    components: {
      PrimaryButton,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<PrimaryButton v-bind="args">Learn More</PrimaryButton>',
  }),
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
  render: (args): object => ({
    components: {
      PrimaryButton,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<PrimaryButton v-bind="args">View Details</PrimaryButton>',
  }),
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
  },
  render: (args): object => ({
    components: {
      PrimaryButton,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<PrimaryButton v-bind="args">Processing</PrimaryButton>',
  }),
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
  render: (args): object => ({
    components: {
      PrimaryButton,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<PrimaryButton v-bind="args">Disabled Button</PrimaryButton>',
  }),
};

export const WithoutChevron: Story = {
  args: {
    variant: 'primary',
    showChevron: false,
  },
  render: (args): object => ({
    components: {
      PrimaryButton,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<PrimaryButton v-bind="args">No Chevron</PrimaryButton>',
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: {
      PrimaryButton,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <PrimaryButton variant="primary">Primary</PrimaryButton>
          <PrimaryButton variant="outline">Outline</PrimaryButton>
          <PrimaryButton variant="text">Text</PrimaryButton>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <PrimaryButton variant="primary" :loading="true">Loading</PrimaryButton>
          <PrimaryButton variant="outline" :loading="true">Loading</PrimaryButton>
          <PrimaryButton variant="text" :loading="true">Loading</PrimaryButton>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <PrimaryButton variant="primary" :disabled="true">Disabled</PrimaryButton>
          <PrimaryButton variant="outline" :disabled="true">Disabled</PrimaryButton>
          <PrimaryButton variant="text" :disabled="true">Disabled</PrimaryButton>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <PrimaryButton variant="primary" :show-chevron="false">No Chevron</PrimaryButton>
          <PrimaryButton variant="outline" :show-chevron="false">No Chevron</PrimaryButton>
          <PrimaryButton variant="text" :show-chevron="false">No Chevron</PrimaryButton>
        </div>
      </div>
    `,
  }),
};
