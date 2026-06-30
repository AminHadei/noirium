import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import { Input } from '@/features/forms';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('');
      return { value };
    },
    template: '<Input v-model="value" />',
  }),
};
