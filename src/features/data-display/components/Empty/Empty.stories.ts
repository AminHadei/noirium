import type { Meta, StoryObj } from '@storybook/vue3-vite';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from '@/features/data-display';

const meta = {
  title: 'Data Display/Empty',
  component: Empty,
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Empty, EmptyContent, EmptyIcon, EmptyTitle, EmptyDescription },
    template: `
      <Empty>
        <EmptyContent>
          <EmptyIcon />
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>Try adjusting your filters.</EmptyDescription>
        </EmptyContent>
      </Empty>
    `,
  }),
};
