import type { Meta, StoryObj } from '@storybook/vue3-vite';

import type { ToastProviderProps } from './ToastProvider.vue';
import ToastProvider from './ToastProvider.vue';
import ToastProviderStoryDemo from './ToastProviderStoryDemo.vue';

const meta = {
  title: 'Feedback/Toaster',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: {
    maxToasts: {
      control: 'number',
      description: 'Maximum number of toasts to display simultaneously',
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the toast container',
    },
  },
  args: {
    maxToasts: 6,
    position: 'top-right',
  },
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastProviderStoryDemo,
    },
    setup(): { args: ToastProviderProps } {
      return { args };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastProviderStoryDemo />
      </ToastProvider>
    `,
  }),
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function storyWithArgs(overrides: Partial<ToastProviderProps> = {}): Story {
  return {
    args: overrides,
  };
}

export const Default: Story = {};

export const TopLeft: Story = storyWithArgs({ position: 'top-left' });

export const BottomRight: Story = storyWithArgs({ position: 'bottom-right' });

export const BottomLeft: Story = storyWithArgs({ position: 'bottom-left' });

export const Stacking: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastProviderStoryDemo,
    },
    setup(): { args: ToastProviderProps } {
      return { args };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastProviderStoryDemo variant="stacking" />
      </ToastProvider>
    `,
  }),
};

export const MaxToasts: Story = storyWithArgs({ maxToasts: 3 });
