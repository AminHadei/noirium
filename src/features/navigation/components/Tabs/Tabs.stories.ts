import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/navigation';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    template: `
      <Tabs default-value="account" style="max-width: 480px;">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Manage your account settings here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    `,
  }),
};
