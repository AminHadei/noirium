import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import { Toggle } from '@/features/forms';
import { TOGGLE_VARIANT_OUTLINE_MUTED } from '@/features/forms/components/Toggle/toggle.constants';

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'solid', TOGGLE_VARIANT_OUTLINE_MUTED],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): object => ({
    components: { Toggle },
    setup: (): object => {
      const on = ref(false);
      return { args, on };
    },
    template: '<Toggle v-bind="args" v-model="on">Bold</Toggle>',
  }),
};
