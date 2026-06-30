import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { TableOfContents } from '@/features/navigation';

const meta = {
  title: 'Navigation/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Manual: Story = {
  render: () => ({
    components: { TableOfContents },
    setup: (): object => ({
      data: [
        { id: 'intro', title: 'Introduction', depth: 2 },
        { id: 'install', title: 'Installation', depth: 2 },
        { id: 'cli', title: 'Using the CLI', depth: 3 },
        { id: 'manual', title: 'Manual setup', depth: 3 },
        { id: 'usage', title: 'Usage', depth: 2 },
      ],
    }),
    template: '<TableOfContents :data="data" />',
  }),
};
