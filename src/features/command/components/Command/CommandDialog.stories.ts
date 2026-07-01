import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/features/command';
import { PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Command/CommandDialog',
  component: CommandDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof CommandDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (): object => ({
    components: {
      CommandDialog,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      PrimaryButton,
    },
    setup: (): object => {
      const open = ref(false);
      return { open };
    },
    template: `
      <div>
        <PrimaryButton :show-chevron="false" @click="open = true">Open command dialog</PrimaryButton>
        <CommandDialog v-model:open="open">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">Calendar</CommandItem>
              <CommandItem value="search">Search</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    `,
  }),
};
