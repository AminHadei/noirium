import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import { ToggleGroup, ToggleGroupItem } from '@/features/forms';

const meta = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem },
    setup: (): object => {
      const value = ref('center');
      return { value };
    },
    template: `
      <ToggleGroup v-model="value" variant="outlined">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem },
    setup: (): object => {
      const value = ref(['bold']);
      return { value };
    },
    template: `
      <ToggleGroup v-model="value" type="multiple" variant="solid">
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
        <ToggleGroupItem value="underline">U</ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
};
