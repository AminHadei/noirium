import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { ref } from 'vue';

import { BaseDialog, PrimaryButton } from '@/features/shared';

const meta = {
  title: 'Shared UI/BaseDialog',
  component: BaseDialog,
  tags: ['autodocs'],
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Controls dialog visibility (v-model:visible)',
    },
    header: {
      control: 'text',
      description: 'Dialog header text',
    },
    closable: {
      control: 'boolean',
      description: 'Whether the dialog can be closed',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close dialog when ESC key is pressed',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Close dialog when clicking the overlay',
    },
    width: {
      control: 'text',
      description: 'Dialog width (CSS value)',
    },
    maxWidth: {
      control: 'text',
      description: 'Dialog max width (CSS value)',
    },
    modal: {
      control: 'boolean',
      description: 'Show backdrop overlay',
    },
  },
  args: {
    visible: false,
    closable: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    width: '500px',
    maxWidth: '90vw',
    modal: true,
    'onUpdate:visible': fn(),
    onOpen: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof BaseDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHeader: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        return {
          args: restArgs,
          isOpen,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Dialog</PrimaryButton>
          <BaseDialog v-model:visible="isOpen" v-bind="args" header="Important Message">
            <p class="m-0">This dialog has a header title.</p>
            <p class="m-0">You can customize it via the header prop or use the #header slot for more control.</p>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const WithFooter: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        const handleConfirm = (): void => {
          alert('Confirmed!');
          isOpen.value = false;
        };
        return {
          args: restArgs,
          isOpen,
          handleConfirm,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Dialog</PrimaryButton>
          <BaseDialog v-model:visible="isOpen" v-bind="args" header="Confirm Action">
            <p class="m-0">Are you sure you want to proceed with this action?</p>

            <template #footer>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <PrimaryButton variant="outline" @click="isOpen = false">Cancel</PrimaryButton>
                <PrimaryButton variant="primary" @click="handleConfirm">Confirm</PrimaryButton>
              </div>
            </template>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const CustomWidth: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        return {
          args: restArgs,
          isOpen,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Wide Dialog</PrimaryButton>
          <BaseDialog v-model:visible="isOpen" v-bind="args" header="Wide Dialog" width="800px">
            <p class="m-0">This dialog is wider than the default (800px instead of 500px).</p>
            <p class="m-0">You can use any CSS unit: px, %, rem, vw, etc.</p>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const NotClosable: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        return {
          args: restArgs,
          isOpen,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Persistent Dialog</PrimaryButton>
          <BaseDialog
            v-model:visible="isOpen"
            v-bind="args"
            header="Persistent Dialog"
            :closable="false"
            :close-on-escape="false"
            :close-on-click-outside="false"
          >
            <p class="m-0">This dialog cannot be closed using the X button, ESC key, or by clicking outside.</p>
            <p class="m-0">You must explicitly set visible to false.</p>
            <PrimaryButton variant="primary" @click="isOpen = false" class="mt-6">Close Programmatically</PrimaryButton>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const CustomHeaderSlot: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        return {
          args: restArgs,
          isOpen,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Dialog with Custom Header</PrimaryButton>
          <BaseDialog v-model:visible="isOpen" v-bind="args">
            <template #header>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 32px; height: 32px; background: #171717; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                  ✓
                </div>
                <div>
                  <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #0A0A0A;">Success!</h2>
                  <p style="margin: 0; font-size: 0.875rem; color: #A3A3A3;">Your action was completed</p>
                </div>
              </div>
            </template>

            <p class="m-0">This dialog uses a custom header slot with an icon and subtitle.</p>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const CompletelyCustomDialog: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        return {
          args: restArgs,
          isOpen,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Completely Custom Dialog</PrimaryButton>
          <BaseDialog v-model:visible="isOpen" v-bind="args" width="600px">
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #262626 0%, #171717 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);">
                  <span style="font-size: 2.5rem; color: white;">🎉</span>
                </div>

                <h2 style="margin: 0 0 0.75rem 0; font-size: 1.75rem; font-weight: 700; color: #0A0A0A;">
                  Welcome to Our Platform!
                </h2>

                <p style="margin: 0 0 2rem 0; font-size: 1rem; color: #525252; line-height: 1.6;">
                  This is a completely custom dialog using the <code>#dialog</code> slot.<br/>
                  You have full control over the entire dialog content and structure.
                </p>

                <div style="display: flex; gap: 1rem; width: 100%;">
                  <PrimaryButton variant="outline" @click="isOpen = false">Maybe Later</PrimaryButton>
                  <PrimaryButton variant="primary" @click="isOpen = false">Get Started</PrimaryButton>
                </div>
              </div>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const RefMethods: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const dialogRef = ref();

        const openDialog = (): void => {
          dialogRef.value?.open();
        };

        const closeDialog = (): void => {
          dialogRef.value?.close();
        };

        const toggleDialog = (): void => {
          dialogRef.value?.toggle();
        };

        return {
          args: restArgs,
          dialogRef,
          openDialog,
          closeDialog,
          toggleDialog,
        };
      },
      template: `
        <div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <PrimaryButton @click="openDialog">Open via Ref</PrimaryButton>
            <PrimaryButton @click="toggleDialog" variant="text">Toggle via Ref</PrimaryButton>
          </div>

          <BaseDialog ref="dialogRef" v-bind="args" header="Controlled via Ref Methods">
            <p class="m-0">This dialog is controlled using exposed methods accessed via component ref:</p>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
              <li><code>dialogRef.open()</code> - Opens the dialog</li>
              <li><code>dialogRef.close()</code> - Closes the dialog</li>
              <li><code>dialogRef.toggle()</code> - Toggles open/close state</li>
            </ul>
            <p style="color: #A3A3A3; font-size: 0.875rem;">
              This is useful when you need to control the dialog programmatically without managing state.
            </p>

            <template #footer>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <PrimaryButton variant="outline" @click="closeDialog">Cancel</PrimaryButton>
                <PrimaryButton variant="primary" @click="closeDialog">Confirm</PrimaryButton>
              </div>
            </template>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const NestedDialogs: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOuterOpen = ref(false);
        const isInnerOpen = ref(false);
        return { args: restArgs, isOuterOpen, isInnerOpen };
      },
      template: `
        <div>
          <PrimaryButton @click="isOuterOpen = true">Open Outer Dialog</PrimaryButton>

          <BaseDialog v-model:visible="isOuterOpen" v-bind="args" header="Outer Dialog" width="600px">
            <p class="m-0">This is the outer dialog. You can open another dialog on top of it.</p>

            <template #footer>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <PrimaryButton variant="outline" @click="isOuterOpen = false">Close</PrimaryButton>
                <PrimaryButton variant="primary" @click="isInnerOpen = true">Open Inner Dialog</PrimaryButton>
              </div>
            </template>
          </BaseDialog>

          <BaseDialog v-model:visible="isInnerOpen" v-bind="args" header="Inner Dialog" width="400px">
            <p class="m-0">This inner dialog sits on top of the outer one.</p>
            <p class="m-0">Both dialogs handle ESC and click-outside independently.</p>

            <template #footer>
              <div style="display: flex; justify-content: flex-end;">
                <PrimaryButton variant="primary" @click="isInnerOpen = false">Close Inner</PrimaryButton>
              </div>
            </template>
          </BaseDialog>
        </div>
      `,
    };
  },
};

export const LongContent: Story = {
  render: (args): object => {
    const { visible: _visible, ...restArgs } = args;
    return {
      components: {
        BaseDialog,
        PrimaryButton,
      },
      setup(): object {
        const isOpen = ref(false);
        return {
          args: restArgs,
          isOpen,
        };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Dialog with Long Content</PrimaryButton>
          <BaseDialog v-model:visible="isOpen" v-bind="args" header="Terms and Conditions">
            <div>
              <p class="m-0"><strong>1. Introduction</strong></p>
              <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

              <p class="m-0"><strong>2. User Agreement</strong></p>
              <p class="m-0">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

              <p class="m-0"><strong>3. Privacy Policy</strong></p>
              <p class="m-0">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

              <p class="m-0"><strong>4. Terms of Service</strong></p>
              <p class="m-0">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <p class="m-0"><strong>5. Disclaimer</strong></p>
              <p class="m-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>

              <p class="m-0"><strong>6. Contact Information</strong></p>
              <p class="m-0">Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

              <p class="m-0"><strong>7. Additional Terms</strong></p>
              <p class="m-0">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.</p>

              <p class="m-0"><strong>8. Final Notes</strong></p>
              <p class="m-0">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
            </div>

            <template #footer>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <PrimaryButton variant="outline" @click="isOpen = false">Decline</PrimaryButton>
                <PrimaryButton variant="primary" @click="isOpen = false">Accept</PrimaryButton>
              </div>
            </template>
          </BaseDialog>
        </div>
      `,
    };
  },
};
