import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/features/navigation';
import { PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Menu, MenuTrigger, MenuContent, MenuItem, PrimaryButton },
    template: `
      <div style="padding: 4rem;">
        <Menu>
          <MenuTrigger>
            <PrimaryButton variant="outline">Open menu</PrimaryButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem disabled>Disabled</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    `,
  }),
};
