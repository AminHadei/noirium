import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Alert, AlertDescription, AlertTitle } from '@/features/feedback';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'solid'] },
    status: { control: 'select', options: ['error', 'success', 'warning', 'info'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorStatus: Story = {
  args: { status: 'error' },
  render: (args) => ({
    components: { Alert, AlertTitle, AlertDescription },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Check your card details and try again.</AlertDescription>
      </Alert>
    `,
  }),
};

export const SuccessStatus: Story = {
  args: { status: 'success' },
  render: ErrorStatus.render,
};
