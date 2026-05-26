import type { StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import { PrimaryButton } from '@/features/shared';

import Toast from './Toast.vue';

const meta = {
  title: 'Shared UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'error', 'success', 'warning'],
      description: 'Toast type',
    },
    title: {
      control: 'text',
      description: 'Toast title (optional)',
    },
    description: {
      control: 'text',
      description: 'Toast description',
    },
    duration: {
      control: 'number',
      description: 'Auto-close duration in milliseconds (0 to disable)',
    },
    closable: {
      control: 'boolean',
      description: 'Whether the toast can be closed',
    },
  },
  args: {
    id: 'toast-1',
    type: 'info',
    title: 'Title',
    description: 'Description',
    duration: 5000,
    closable: true,
    onClose: (): void => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Information',
    description: 'This is an informational message.',
  },
};

export const ErrorToast: Story = {
  args: {
    type: 'error',
    title: 'Error',
    description: 'Something went wrong. Please try again.',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Success',
    description: 'Your action was completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    description: 'Please review this before proceeding.',
  },
};

export const WithoutTitle: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast :id="args.id" type="info" description="This is an info toast without a title." :closable="args.closable" />
        <Toast :id="args.id + '-2'" type="error" description="This is an error toast without a title." :closable="args.closable" />
        <Toast :id="args.id + '-3'" type="success" description="This is a success toast without a title." :closable="args.closable" />
        <Toast :id="args.id + '-4'" type="warning" description="This is a warning toast without a title." :closable="args.closable" />
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};

export const WithoutDescription: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast :id="args.id" type="info" title="Info Toast Title" :closable="args.closable" />
        <Toast :id="args.id + '-2'" type="error" title="Error Toast Title" :closable="args.closable" />
        <Toast :id="args.id + '-3'" type="success" title="Success Toast Title" :closable="args.closable" />
        <Toast :id="args.id + '-4'" type="warning" title="Warning Toast Title" :closable="args.closable" />
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};

export const WithoutClose: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" type="info" title="Title" description="Description" :closable="false" />
        <Toast v-bind="args" type="error" title="Title" description="Description" :closable="false" />
        <Toast v-bind="args" type="success" title="Title" description="Description" :closable="false" />
        <Toast v-bind="args" type="warning" title="Title" description="Description" :closable="false" />
      </div>
    `,
  }),
};

export const WithoutCloseAndTitle: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" type="info" description="Description" :closable="false" />
        <Toast v-bind="args" type="error" description="Description" :closable="false" />
        <Toast v-bind="args" type="success" description="Description" :closable="false" />
        <Toast v-bind="args" type="warning" description="Description" :closable="false" />
      </div>
    `,
  }),
};

export const AllTypes: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" id="toast-1" type="info" title="Title" description="Description" />
        <Toast v-bind="args" id="toast-2" type="error" title="Title" description="Description" />
        <Toast v-bind="args" id="toast-3" type="success" title="Title" description="Description" />
        <Toast v-bind="args" id="toast-4" type="warning" title="Title" description="Description" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: (args): object => ({
    components: {
      Toast,
      PrimaryButton,
    },
    setup(): object {
      const isVisible = ref(false);
      return {
        args,
        isVisible,
      };
    },
    template: `
      <div>
        <div class="mb-4 flex gap-2">
          <PrimaryButton @click="isVisible = !isVisible">
            {{ isVisible ? 'Hide' : 'Show' }} Toast
          </PrimaryButton>
        </div>
        <Toast
          v-if="isVisible"
          v-bind="args"
          @close="isVisible = false"
        />
      </div>
    `,
  }),
  args: {
    type: 'success',
    title: 'Interactive Toast',
    description: 'Click the button to show/hide this toast.',
  },
};

export const LongContent: Story = {
  args: {
    type: 'info',
    title: 'Long Title That Might Wrap to Multiple Lines',
    description:
      'This is a longer description that demonstrates how the toast handles content that extends beyond a single line. The toast should properly wrap text and maintain its layout.',
  },
};

export const CustomDuration: Story = {
  render: (args): object => ({
    components: {
      Toast,
      PrimaryButton,
    },
    setup(): object {
      const showToast = ref(false);
      return {
        args,
        showToast,
      };
    },
    template: `
      <div>
        <div class="mb-4 flex gap-2">
          <PrimaryButton @click="showToast = true">
            Show Toast (2 seconds)
          </PrimaryButton>
        </div>
        <Toast
          v-if="showToast"
          v-bind="args"
          :duration="2000"
          @close="showToast = false"
        />
      </div>
    `,
  }),
  args: {
    type: 'info',
    title: 'Short Duration',
    description: 'This toast will auto-close after 2 seconds.',
  },
};

export const Persistent: Story = {
  args: {
    type: 'warning',
    title: 'Persistent Toast',
    description: 'This toast will not auto-close (duration is 0).',
    duration: 0,
  },
};

export const WithTitleSlot: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" id="toast-1" type="info">
          <template #title>
            <span class="font-bold">Custom Title Slot</span>
          </template>
          <template #description>
            This toast uses a slot for the title with custom styling.
          </template>
        </Toast>
        <Toast v-bind="args" id="toast-2" type="success">
          <template #title>
            <span class="text-neutral-800">Success with Slot</span>
          </template>
          <template #description>
            The title slot allows for custom HTML and styling.
          </template>
        </Toast>
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};

export const WithDescriptionSlot: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" id="toast-1" type="info" title="Info Toast">
          <template #description>
            <div>
              <p class="mb-2">This description uses a slot with multiple paragraphs.</p>
              <p class="text-xs opacity-75">You can add any HTML content here.</p>
            </div>
          </template>
        </Toast>
        <Toast v-bind="args" id="toast-2" type="warning" title="Warning Toast">
          <template #description>
            <span class="font-semibold">Bold description</span> with <em>italic text</em> and <a href="#" class="underline">links</a>.
          </template>
        </Toast>
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};

export const WithBothSlots: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" id="toast-1" type="info">
          <template #title>
            <div class="flex items-center gap-2">
              <span class="i-info-circle size-4"></span>
              <span>Custom Title with Icon</span>
            </div>
          </template>
          <template #description>
            Both title and description are using slots, allowing for complete customization.
          </template>
        </Toast>
        <Toast v-bind="args" id="toast-2" type="error">
          <template #title>
            <span class="text-neutral-900 font-bold">Error Alert</span>
          </template>
          <template #description>
            <div class="space-y-1">
              <p>Multiple issues detected:</p>
              <ul class="list-disc list-inside text-sm">
                <li>Issue 1</li>
                <li>Issue 2</li>
              </ul>
            </div>
          </template>
        </Toast>
        <Toast v-bind="args" id="toast-3" type="success">
          <template #title>
            <span class="flex items-center gap-1">
              <span class="i-check-circle size-4"></span>
              Operation Complete
            </span>
          </template>
          <template #description>
            <div>
              <p class="mb-1">Your changes have been saved successfully.</p>
              <p class="text-xs opacity-75">You can continue working or review the changes.</p>
            </div>
          </template>
        </Toast>
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};

export const SlotsWithRichContent: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Toast v-bind="args" id="toast-1" type="info">
          <template #title>
            <div class="flex items-center justify-between w-full">
              <span>Notification</span>
              <span class="text-xs opacity-60">Just now</span>
            </div>
          </template>
          <template #description>
            <div class="space-y-2">
              <p>This toast demonstrates rich content in slots:</p>
              <div class="flex gap-2">
                <button class="px-2 py-1 text-xs bg-neutral-200 rounded">Action 1</button>
                <button class="px-2 py-1 text-xs bg-neutral-200 rounded">Action 2</button>
              </div>
            </div>
          </template>
        </Toast>
        <Toast v-bind="args" id="toast-2" type="warning">
          <template #title>
            <span class="flex items-center gap-2">
              <span class="i-alert-triangle size-4"></span>
              <span>Important Notice</span>
            </span>
          </template>
          <template #description>
            <div>
              <p class="mb-2">Slots allow you to include interactive elements:</p>
              <div class="flex items-center gap-2 text-sm">
                <input type="checkbox" id="acknowledge" class="size-3" />
                <label for="acknowledge" class="cursor-pointer">I understand</label>
              </div>
            </div>
          </template>
        </Toast>
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};

export const SlotsVsProps: Story = {
  render: (args): object => ({
    components: {
      Toast,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-sm font-semibold mb-2">Using Props:</h3>
          <Toast v-bind="args" id="toast-props" type="info" title="Props Example" description="This toast uses props for title and description." />
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2">Using Slots:</h3>
          <Toast v-bind="args" id="toast-slots" type="info">
            <template #title>Slots Example</template>
            <template #description>This toast uses slots for title and description.</template>
          </Toast>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2">Mixed (Props with Slot Override):</h3>
          <Toast v-bind="args" id="toast-mixed" type="success" title="Props Title" description="Props Description">
            <template #title>
              <span class="text-neutral-800 font-bold">Slot Title (overrides props)</span>
            </template>
          </Toast>
        </div>
      </div>
    `,
  }),
  args: {
    closable: true,
  },
};
