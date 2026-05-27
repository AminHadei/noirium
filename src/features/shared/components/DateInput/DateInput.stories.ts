import type { Meta, StoryObj } from '@storybook/vue3-vite';
import dayjs from 'dayjs';

import DatePicker from '../DatePicker/DatePicker.vue';
import DateInput from './DateInput.vue';

const meta = {
  title: 'Shared UI/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Test date',
    modelValue: dayjs().subtract(1, 'day').toDate(),
  },
  argTypes: {
    label: {
      type: 'string',
    },
    modelValue: {
      type: 'string',
      control: 'date',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A date input component with a label and a date picker.',
      },
    },
  },
  render: (args): object => ({
    components: {
      DateInput,
      DatePicker,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<DateInput v-bind="args" />',
  }),
};
