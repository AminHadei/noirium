import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { type VNode, defineComponent, h, ref } from 'vue';

import { Modal, PrimaryButton } from '@/features/shared';
import { useModalContext } from '@/features/shared/components/Modal/Modal.context';

const meta = {
  title: 'Shared UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A pluggable modal shell with built-in `default` and `fullscreen` layouts.',
      },
    },
  },
  argTypes: {
    layout: {
      control: 'radio',
      options: ['default', 'fullscreen'],
      description: 'Choose one of the built-in modal layouts.',
    },
    visible: { control: 'boolean', description: 'Controls the open state.' },
    title: { control: 'text', description: 'Header text for built-in layouts.' },
    closable: { control: 'boolean', description: 'Enables user-driven close actions.' },
    showCloseButton: { control: 'boolean', description: 'Shows or hides the close button.' },
    closeOnEscape: { control: 'boolean', description: 'Closes the topmost modal on Escape.' },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Closes the modal when the backdrop is clicked.',
    },
    modalOnly: {
      control: 'boolean',
      description: 'Switches the default layout between modal-only and bottom-sheet behavior.',
    },
    lockScroll: { control: 'boolean', description: 'Locks body scroll while the modal is open.' },
  },
  args: {
    visible: false,
    layout: 'default',
    closable: true,
    showCloseButton: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    modalOnly: true,
    lockScroll: true,
    'onUpdate:visible': fn(),
    onOpen: fn(),
    onClose: fn(),
    'onTried-close': fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTitle: Story = {
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        return { args: rest, isOpen };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Modal</PrimaryButton>
          <Modal v-model:visible="isOpen" v-bind="args" title="Important Message">
            <p class="m-0">This modal has a title rendered via the prop.</p>
          </Modal>
        </div>
      `,
    };
  },
};

export const WithFooter: Story = {
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        const confirm = (): void => {
          isOpen.value = false;
        };
        return { args: rest, isOpen, confirm };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Modal</PrimaryButton>
          <Modal v-model:visible="isOpen" v-bind="args" title="Confirm Action">
            <p class="m-0">Are you sure you want to proceed?</p>
            <template #footer>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <PrimaryButton variant="outline" @click="isOpen = false">Cancel</PrimaryButton>
                <PrimaryButton variant="primary" @click="confirm">Confirm</PrimaryButton>
              </div>
            </template>
          </Modal>
        </div>
      `,
    };
  },
};

export const ResponsiveBottomSheet: Story = {
  args: { modalOnly: false },
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        return { args: rest, isOpen };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open (resize below 768px)</PrimaryButton>
          <Modal v-model:visible="isOpen" v-bind="args" title="Adaptive Modal">
            <p class="m-0">Resize the viewport — below 768px this slides up as a bottom sheet.</p>
            <p class="m-0">Above the breakpoint it renders as a centered modal.</p>
          </Modal>
        </div>
      `,
    };
  },
};

export const Fullscreen: Story = {
  args: { layout: 'fullscreen' },
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        return { args: rest, isOpen };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Fullscreen</PrimaryButton>
          <Modal v-model:visible="isOpen" v-bind="args" title="Fullscreen Modal">
            <p class="m-0">Edge-to-edge layout for immersive content.</p>
          </Modal>
        </div>
      `,
    };
  },
};

export const NotClosable: Story = {
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        const triedToClose = ref(0);
        const onTriedClose = (): void => {
          triedToClose.value += 1;
        };
        return { args: rest, isOpen, triedToClose, onTriedClose };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Persistent Modal</PrimaryButton>
          <p style="margin-top: 0.5rem; color: #A3A3A3;">Tried to close: {{ triedToClose }} time(s)</p>
          <Modal
            v-model:visible="isOpen"
            v-bind="args"
            title="Persistent"
            :closable="false"
            @tried-close="onTriedClose"
          >
            <p class="m-0">Click the backdrop or press Escape — the parent will be notified, but the modal stays open.</p>
            <PrimaryButton class="mt-4" @click="isOpen = false">Close programmatically</PrimaryButton>
          </Modal>
        </div>
      `,
    };
  },
};

export const CustomClasses: Story = {
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        const classes = {
          backdrop: ':uno: bg-black/40 backdrop-blur-md',
          body: ':uno: bg-gradient-to-br from-neutral-100 to-white border-2 border-neutral-200',
          header: ':uno: bg-neutral-100',
        };
        return { args: rest, isOpen, classes };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open Themed Modal</PrimaryButton>
          <Modal v-model:visible="isOpen" v-bind="args" title="Themed" :classes="classes">
            <p class="m-0">Every zone — backdrop, wrapper, body, header, content, footer, close button — accepts a class override.</p>
          </Modal>
        </div>
      `,
    };
  },
};

export const Stacked: Story = {
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const outer = ref(false);
        const inner = ref(false);
        return { args: rest, outer, inner };
      },
      template: `
        <div>
          <PrimaryButton @click="outer = true">Open Outer</PrimaryButton>
          <Modal v-model:visible="outer" v-bind="args" title="Outer">
            <p class="m-0">Open another modal on top.</p>
            <template #footer>
              <PrimaryButton @click="inner = true">Open Inner</PrimaryButton>
            </template>
          </Modal>
          <Modal v-model:visible="inner" v-bind="args" title="Inner">
            <p class="m-0">Escape only closes the topmost modal.</p>
          </Modal>
        </div>
      `,
    };
  },
};

const CustomLayout = defineComponent({
  name: 'BrandedLayout',
  setup(_, { slots }) {
    const ctx = useModalContext();
    return (): VNode =>
      h(
        'div',
        {
          'data-noirium-modal-root': '',
          role: 'dialog',
          'aria-modal': 'true',
          class: ':uno: fixed inset-0 flex items-center justify-center p-6',
          style: { zIndex: 100001 },
          onClick: (e: MouseEvent): void => {
            if (e.target === e.currentTarget) ctx.requestClose();
          },
        },
        [
          h(
            'div',
            {
              class:
                ':uno: bg-gradient-to-br from-neutral-900 to-neutral-700 text-white rounded-3xl p-8 shadow-2xl max-w-md',
            },
            [
              h('h2', { class: ':uno: m-0 text-2xl font-bold' }, ctx.title.value ?? 'Branded'),
              h('div', { class: ':uno: mt-4' }, slots['default']?.()),
              h(
                'button',
                {
                  class: ':uno: mt-6 px-4 py-2 bg-white/20 rounded-md',
                  onClick: ctx.requestClose,
                },
                'Close',
              ),
            ],
          ),
        ],
      );
  },
});

export const CustomLayoutComponent: Story = {
  render: (args): object => {
    const { visible: _v, ...rest } = args;
    return {
      components: { Modal, PrimaryButton },
      setup(): object {
        const isOpen = ref(false);
        return { args: rest, isOpen, CustomLayout };
      },
      template: `
        <div>
          <PrimaryButton @click="isOpen = true">Open With Custom Layout</PrimaryButton>
          <Modal v-model:visible="isOpen" v-bind="args" title="Branded" :layout="CustomLayout">
            Consumers can pass any component as a layout.
          </Modal>
        </div>
      `,
    };
  },
};
