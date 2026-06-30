import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/features/feedback';
import { PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Feedback/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
  args: {
    direction: 'right',
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): object => ({
    components: {
      Drawer,
      DrawerTrigger,
      DrawerContent,
      DrawerHeader,
      DrawerTitle,
      DrawerDescription,
      DrawerFooter,
      DrawerClose,
      PrimaryButton,
    },
    setup: (): object => {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <Drawer v-model:open="open" :direction="args.direction">
        <DrawerTrigger>
          <PrimaryButton>Open drawer</PrimaryButton>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer title</DrawerTitle>
            <DrawerDescription>A side panel that slides into view.</DrawerDescription>
          </DrawerHeader>
          <div style="padding: 1rem; flex: 1;">Drawer body content.</div>
          <DrawerFooter>
            <DrawerClose>
              <PrimaryButton variant="outline" style="width: 100%;">Close</PrimaryButton>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
};
