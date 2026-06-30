import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Label } from '@/features/forms';

const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Label },
    template: `
      <div class="space-y-2">
        <Label for="name">Full name</Label>
        <input id="name" class="form-main-input w-full rounded-lg px-5 py-2" />
      </div>
    `,
  }),
};
