import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { type VNode, defineComponent, h, nextTick } from 'vue';

import { useModalContext } from '@/features/shared/components/Modal/Modal.context';
import Modal from '@/features/shared/components/Modal/Modal.vue';

const flushTransitions = async (): Promise<void> => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 320));
};

describe('Modal', () => {
  let wrapper: VueWrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.classList.remove('noirium-modal-scroll-locked');
    document.body.style.top = '';
  });

  describe('Rendering', () => {
    it('does not render when visible is false', () => {
      wrapper = mount(Modal, { props: { visible: false } });
      expect(document.querySelector('[data-noirium-modal-root]')).toBeFalsy();
    });

    it('renders backdrop and dialog when visible', async () => {
      wrapper = mount(Modal, { props: { visible: true }, attachTo: document.body });
      await nextTick();

      expect(document.querySelector('[data-noirium-modal-backdrop]')).toBeTruthy();
      expect(document.querySelector('[data-noirium-modal-root]')).toBeTruthy();
      expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    });

    it('renders title via prop', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, title: 'Hello' },
        attachTo: document.body,
      });
      await nextTick();
      expect(document.body.textContent).toContain('Hello');
    });

    it('renders default slot content', async () => {
      wrapper = mount(Modal, {
        props: { visible: true },
        slots: { default: '<p>body</p>' },
        attachTo: document.body,
      });
      await nextTick();
      expect(document.body.textContent).toContain('body');
    });

    it('renders header, footer, and close-icon slots', async () => {
      wrapper = mount(Modal, {
        props: { visible: true },
        slots: {
          header: '<h2>HDR</h2>',
          footer: '<button>FTR</button>',
          'close-icon': '<svg data-test-icon></svg>',
        },
        attachTo: document.body,
      });
      await nextTick();
      expect(document.body.textContent).toContain('HDR');
      expect(document.body.textContent).toContain('FTR');
      expect(document.querySelector('[data-test-icon]')).toBeTruthy();
    });

    it('renders close button by default and hides it when showCloseButton is false', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, title: 'x' },
        attachTo: document.body,
      });
      await nextTick();
      expect(document.querySelector('[data-noirium-modal-close]')).toBeTruthy();

      await wrapper.setProps({ showCloseButton: false });
      await nextTick();
      expect(document.querySelector('[data-noirium-modal-close]')).toBeFalsy();
    });

    it('renders the close icon by default', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, title: 'x' },
        attachTo: document.body,
      });
      await nextTick();

      expect(document.querySelector('.i-ui-icon-close')).toBeTruthy();
    });

    it('hides close button when closable is false', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, closable: false, title: 'x' },
        attachTo: document.body,
      });
      await nextTick();
      expect(document.querySelector('[data-noirium-modal-close]')).toBeFalsy();
    });

    it('includes built-in dark utility classes on the default layout', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, title: 'Dark' },
        attachTo: document.body,
      });
      await nextTick();

      const body = document.querySelector<HTMLElement>('[data-noirium-modal-body]');
      const header = document.querySelector<HTMLElement>('[data-noirium-modal-body] > div');

      expect(body?.className).toContain('dark:bg-zinc-700');
      expect(header?.className).toContain('dark:bg-zinc-700');
    });
  });

  describe('v-model:visible and lifecycle events', () => {
    it('emits update:visible(false) and close on closing', async () => {
      const onUpdate = vi.fn<() => void>();
      const onClose = vi.fn<() => void>();
      wrapper = mount(Modal, {
        props: { visible: true, 'onUpdate:visible': onUpdate, onClose },
        attachTo: document.body,
      });
      await nextTick();

      const btn = document.querySelector('[data-noirium-modal-close]') as HTMLButtonElement | null;
      btn?.click();
      await flushTransitions();

      expect(onUpdate).toHaveBeenCalledWith(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('emits open when programmatically opened', async () => {
      const onOpen = vi.fn<() => void>();
      wrapper = mount(Modal, {
        props: { visible: false, onOpen },
        attachTo: document.body,
      });
      const vm = wrapper.vm as unknown as { open: () => void };
      vm.open();
      await nextTick();
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('reflects external visible prop changes', async () => {
      wrapper = mount(Modal, { props: { visible: false }, attachTo: document.body });
      await nextTick();
      expect(document.querySelector('[data-noirium-modal-root]')).toBeFalsy();

      await wrapper.setProps({ visible: true });
      await nextTick();
      expect(document.querySelector('[data-noirium-modal-root]')).toBeTruthy();
    });

    it('emits tried-close (and not close) when closable is false', async () => {
      const onClose = vi.fn<() => void>();
      const onTried = vi.fn<() => void>();
      wrapper = mount(Modal, {
        props: {
          visible: true,
          closable: false,
          onClose,
          'onTried-close': onTried,
        },
        attachTo: document.body,
      });
      await nextTick();

      const backdrop = document.querySelector(
        '[data-noirium-modal-backdrop]',
      ) as HTMLElement | null;
      backdrop?.click();
      await nextTick();

      expect(onClose).not.toHaveBeenCalled();
      expect(onTried).toHaveBeenCalledTimes(1);
      expect(document.querySelector('[data-noirium-modal-root]')).toBeTruthy();
    });
  });

  describe('Close behavior', () => {
    it('closes on Escape when closeOnEscape is true', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, closeOnEscape: true },
        attachTo: document.body,
      });
      await nextTick();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await flushTransitions();

      expect(document.querySelector('[data-noirium-modal-root]')).toBeFalsy();
    });

    it('does not close on Escape when closeOnEscape is false', async () => {
      const onUpdate = vi.fn<() => void>();
      wrapper = mount(Modal, {
        props: { visible: true, closeOnEscape: false, 'onUpdate:visible': onUpdate },
        attachTo: document.body,
      });
      await nextTick();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await nextTick();
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('does not close when content is clicked', async () => {
      const onUpdate = vi.fn<() => void>();
      wrapper = mount(Modal, {
        props: { visible: true, 'onUpdate:visible': onUpdate },
        slots: { default: '<p>x</p>' },
        attachTo: document.body,
      });
      await nextTick();

      const body = document.querySelector('[data-noirium-modal-body]') as HTMLElement | null;
      body?.click();
      await nextTick();
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('closes on backdrop click when closeOnClickOutside is true', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, closeOnClickOutside: true },
        attachTo: document.body,
      });
      await nextTick();

      const backdrop = document.querySelector(
        '[data-noirium-modal-backdrop]',
      ) as HTMLElement | null;
      backdrop?.click();
      await flushTransitions();

      expect(document.querySelector('[data-noirium-modal-root]')).toBeFalsy();
    });

    it('does not close on backdrop click when closeOnClickOutside is false', async () => {
      const onUpdate = vi.fn<() => void>();
      wrapper = mount(Modal, {
        props: { visible: true, closeOnClickOutside: false, 'onUpdate:visible': onUpdate },
        attachTo: document.body,
      });
      await nextTick();

      const backdrop = document.querySelector(
        '[data-noirium-modal-backdrop]',
      ) as HTMLElement | null;
      backdrop?.click();
      await nextTick();
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Stacking', () => {
    it('only the topmost modal closes on Escape', async () => {
      const outerUpdate = vi.fn<() => void>();
      const innerUpdate = vi.fn<() => void>();

      const outer = mount(Modal, {
        props: { visible: true, 'onUpdate:visible': outerUpdate },
        attachTo: document.body,
      });
      const inner = mount(Modal, {
        props: { visible: true, 'onUpdate:visible': innerUpdate },
        attachTo: document.body,
      });
      await nextTick();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await nextTick();

      expect(innerUpdate).toHaveBeenCalledWith(false);
      expect(outerUpdate).not.toHaveBeenCalled();

      inner.unmount();
      outer.unmount();
    });
  });

  describe('Exposed methods', () => {
    it('exposes open/close/toggle', async () => {
      wrapper = mount(Modal, { props: { visible: false }, attachTo: document.body });
      const vm = wrapper.vm as unknown as {
        open: () => void;
        close: () => void;
        toggle: () => void;
      };
      vm.open();
      await nextTick();
      expect(document.querySelector('[data-noirium-modal-root]')).toBeTruthy();

      vm.toggle();
      await flushTransitions();
      expect(document.querySelector('[data-noirium-modal-root]')).toBeFalsy();
    });
  });

  describe('Custom layout via component', () => {
    it('renders a user-supplied layout component', async () => {
      const Custom = defineComponent({
        name: 'CustomLayout',
        setup() {
          const ctx = useModalContext();
          return (): VNode =>
            h('div', { 'data-noirium-modal-root': '', 'data-test-custom': '', role: 'dialog' }, [
              h('button', { onClick: ctx.requestClose }, ['x']),
            ]);
        },
      });

      wrapper = mount(Modal, {
        props: { visible: true, layout: Custom },
        attachTo: document.body,
      });
      await nextTick();

      expect(document.querySelector('[data-test-custom]')).toBeTruthy();
    });
  });

  describe('Body scroll lock', () => {
    it('locks body when open and releases on close', async () => {
      wrapper = mount(Modal, { props: { visible: true }, attachTo: document.body });
      await nextTick();
      expect(document.body.classList.contains('noirium-modal-scroll-locked')).toBe(true);

      await wrapper.setProps({ visible: false });
      await nextTick();
      expect(document.body.classList.contains('noirium-modal-scroll-locked')).toBe(false);
    });

    it('does not lock body when lockScroll is false', async () => {
      wrapper = mount(Modal, {
        props: { visible: true, lockScroll: false },
        attachTo: document.body,
      });
      await nextTick();
      expect(document.body.classList.contains('noirium-modal-scroll-locked')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('renders dialog role with aria-modal', async () => {
      wrapper = mount(Modal, { props: { visible: true }, attachTo: document.body });
      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });
  });
});
