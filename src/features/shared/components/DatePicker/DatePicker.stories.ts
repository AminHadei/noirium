import type { Meta, StoryObj } from '@storybook/vue3-vite';
import dayjs from 'dayjs';
import { computed, ref, watch } from 'vue';

import { coerceDatePickerModelValue } from './date-picker-story-utils';
import DatePicker from './DatePicker.vue';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
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
      control: 'date',
    },
  },
  render: (args): object => ({
    components: {
      DatePicker,
    },
    setup(): object {
      const modelValue = ref(coerceDatePickerModelValue(args.modelValue));
      watch(
        () => args.modelValue,
        (value) => {
          modelValue.value = coerceDatePickerModelValue(value);
        },
      );
      const pickerArgs = computed(() => ({
        ...args,
        modelValue: modelValue.value,
      }));
      const onUpdate = (value: Date): void => {
        modelValue.value = value;
      };
      return {
        pickerArgs,
        onUpdate,
      };
    },
    template: '<DatePicker v-bind="pickerArgs" @update:model-value="onUpdate" />',
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
