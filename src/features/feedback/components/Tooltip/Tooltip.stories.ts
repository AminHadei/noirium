import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/features/feedback';
import { PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, PrimaryButton },
    template: `
      <div style="padding: 4rem;">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <PrimaryButton variant="outline">Hover me</PrimaryButton>
            </TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, PrimaryButton },
    template: `
      <div style="display: flex; gap: 2rem; padding: 4rem;">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><PrimaryButton variant="outline">Default</PrimaryButton></TooltipTrigger>
            <TooltipContent variant="default">Default tooltip</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger><PrimaryButton variant="outline">Primary</PrimaryButton></TooltipTrigger>
            <TooltipContent variant="primary">Primary tooltip</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger><PrimaryButton variant="outline">Solid</PrimaryButton></TooltipTrigger>
            <TooltipContent variant="solid">Solid tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    `,
  }),
};
