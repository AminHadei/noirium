import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { PrimaryButton } from '@/features/shared';

import { useToast, createToastHelpers } from '../../lib/composables/use-toast';
import ToastProvider from './ToastProvider.vue';

const meta = {
  title: 'Shared UI/ToastProvider',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: {
    maxToasts: {
      control: 'number',
      description: 'Maximum number of toasts to display simultaneously',
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the toast container',
    },
  },
  args: {
    maxToasts: 6,
    position: 'top-right',
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = {
  components: {
    PrimaryButton,
  },
  setup(): object {
    const toast = useToast();
    const helpers = createToastHelpers(toast);

    const showInfo = (): void => {
      helpers.info({
        title: 'Info Toast',
        description: 'This is an informational message.',
      });
    };

    const showError = (): void => {
      helpers.error({
        title: 'Error Toast',
        description: 'Something went wrong.',
      });
    };

    const showSuccess = (): void => {
      helpers.success({
        title: 'Success Toast',
        description: 'Operation completed successfully.',
      });
    };

    const showWarning = (): void => {
      helpers.warning({
        title: 'Warning Toast',
        description: 'Please review before proceeding.',
      });
    };

    const showWithoutTitle = (): void => {
      helpers.info({
        description: 'This toast has no title.',
      });
    };

    const showPersistent = (): void => {
      helpers.info({
        title: 'Persistent Toast',
        description: 'This toast will not auto-close.',
        duration: 0,
      });
    };

    const showCustomDuration = (): void => {
      helpers.success({
        title: 'Short Duration',
        description: 'This toast will close in 2 seconds.',
        duration: 2000,
      });
    };

    const clearAll = (): void => {
      helpers.clearAll();
    };

    return {
      showInfo,
      showError,
      showSuccess,
      showWarning,
      showWithoutTitle,
      showPersistent,
      showCustomDuration,
      clearAll,
    };
  },
  template: `
    <div class="p-4 flex flex-col gap-2">
      <h3 class="text-lg font-semibold mb-2">Toast Actions</h3>
      <div class="flex flex-wrap gap-2">
        <PrimaryButton @click="showInfo">Show Info</PrimaryButton>
        <PrimaryButton @click="showError">Show Error</PrimaryButton>
        <PrimaryButton @click="showSuccess">Show Success</PrimaryButton>
        <PrimaryButton @click="showWarning">Show Warning</PrimaryButton>
        <PrimaryButton @click="showWithoutTitle">Without Title</PrimaryButton>
        <PrimaryButton @click="showPersistent">Persistent</PrimaryButton>
        <PrimaryButton @click="showCustomDuration">Custom Duration</PrimaryButton>
        <PrimaryButton @click="clearAll" variant="outline">Clear All</PrimaryButton>
      </div>
    </div>
  `,
};

export const Default: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastDemo,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastDemo />
      </ToastProvider>
    `,
  }),
};

export const TopLeft: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastDemo,
    },
    setup(): object {
      return {
        args: {
          ...args,
          position: 'top-left',
        },
      };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastDemo />
      </ToastProvider>
    `,
  }),
};

export const BottomRight: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastDemo,
    },
    setup(): object {
      return {
        args: {
          ...args,
          position: 'bottom-right',
        },
      };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastDemo />
      </ToastProvider>
    `,
  }),
};

export const BottomLeft: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastDemo,
    },
    setup(): object {
      return {
        args: {
          ...args,
          position: 'bottom-left',
        },
      };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastDemo />
      </ToastProvider>
    `,
  }),
};

export const Stacking: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      PrimaryButton,
    },
    setup(): object {
      const toast = useToast();
      const helpers = createToastHelpers(toast);

      const addMultipleToasts = (): void => {
        helpers.info({
          title: 'Toast 1',
          description: 'First toast',
        });
        setTimeout((): void => {
          helpers.success({
            title: 'Toast 2',
            description: 'Second toast',
          });
        }, 100);
        setTimeout((): void => {
          helpers.warning({
            title: 'Toast 3',
            description: 'Third toast',
          });
        }, 200);
        setTimeout((): void => {
          helpers.error({
            title: 'Toast 4',
            description: 'Fourth toast',
          });
        }, 300);
        setTimeout((): void => {
          helpers.info({
            title: 'Toast 5',
            description: 'Fifth toast',
          });
        }, 400);
        setTimeout((): void => {
          helpers.success({
            title: 'Toast 6',
            description: 'Sixth toast',
          });
        }, 500);
        setTimeout((): void => {
          helpers.warning({
            title: 'Toast 7',
            description: 'Seventh toast (should remove oldest)',
          });
        }, 600);
      };

      return {
        args,
        addMultipleToasts,
      };
    },
    template: `
      <ToastProvider v-bind="args">
        <div class="p-4">
          <PrimaryButton @click="addMultipleToasts">
            Add 7 Toasts (Max: 6)
          </PrimaryButton>
        </div>
      </ToastProvider>
    `,
  }),
};

export const MaxToasts: Story = {
  render: (args): object => ({
    components: {
      ToastProvider,
      ToastDemo,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: `
      <ToastProvider v-bind="args">
        <ToastDemo />
      </ToastProvider>
    `,
  }),
  args: {
    maxToasts: 3,
  },
};
