import type { Meta, StoryObj } from '@storybook/vue3-vite';
import dayjs from 'dayjs';

import DatePicker from './DatePicker.vue';

const meta: Meta<typeof DatePicker> = {
  title: 'Shared UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    modelValue: dayjs().subtract(1, 'day').toDate(),
  },
  argTypes: {
    disabledDates: {
      control: 'object',
    },
    modelValue: {
      type: 'string',
      control: 'date',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args): object => ({
    components: {
      DatePicker,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<DatePicker v-bind="args" />',
  }),
};
