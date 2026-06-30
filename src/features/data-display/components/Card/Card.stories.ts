import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/data-display';

const meta = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <Card style="max-width: 320px;">
        <CardHeader>
          <CardTitle>This is a Card Title</CardTitle>
          <CardDescription>A short supporting description for the card.</CardDescription>
        </CardHeader>
        <CardContent>
          Card content goes here — drop any markup you like inside.
        </CardContent>
      </Card>
    `,
  }),
};
