import type { Meta, StoryObj } from '@storybook/vue3-vite';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/features/feedback';
import { PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      PopoverHeader,
      PopoverTitle,
      PopoverDescription,
      PrimaryButton,
    },
    template: `
      <div style="padding: 4rem;">
        <Popover>
          <PopoverTrigger>
            <PrimaryButton variant="outline">Open popover</PrimaryButton>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
};
