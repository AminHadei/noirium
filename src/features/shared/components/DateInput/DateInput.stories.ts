import type { Meta, StoryObj } from '@storybook/vue3-vite';
import dayjs from 'dayjs';
import { computed, ref, watch } from 'vue';

import { coerceDatePickerModelValue } from '../DatePicker/date-picker-story-utils';
import DateInput from './DateInput.vue';

const meta = {
  title: 'Forms/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {
    label: {
      type: 'string',
    },
    modelValue: {
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
    },
    setup(): object {
      const modelValue = ref(coerceDatePickerModelValue(args.modelValue));
      watch(
        () => args.modelValue,
        (value) => {
          modelValue.value = coerceDatePickerModelValue(value);
        },
      );
      const inputArgs = computed(() => ({
        ...args,
        modelValue: modelValue.value,
      }));
      const onUpdate = (value: Date): void => {
        modelValue.value = value;
      };
      return {
        inputArgs,
        onUpdate,
      };
    },
    template: '<DateInput v-bind="inputArgs" @update:model-value="onUpdate" />',
  }),
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Test date',
    modelValue: dayjs().subtract(1, 'day').toDate(),
  },
};
