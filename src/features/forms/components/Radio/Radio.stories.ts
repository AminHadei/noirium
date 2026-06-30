import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import { RadioGroup, RadioGroupItem } from '@/features/forms';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { RadioGroup, RadioGroupItem },
    setup: (): object => {
      const value = ref('comfortable');
      return { value };
    },
    template: `
      <RadioGroup v-model="value">
        <label style="display:flex; gap:.5rem; align-items:center;">
          <RadioGroupItem value="default" /> Default
        </label>
        <label style="display:flex; gap:.5rem; align-items:center;">
          <RadioGroupItem value="comfortable" /> Comfortable
        </label>
        <label style="display:flex; gap:.5rem; align-items:center;">
          <RadioGroupItem value="compact" /> Compact
        </label>
      </RadioGroup>
    `,
  }),
};
