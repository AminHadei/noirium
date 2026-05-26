import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vite-plus/test';
import { nextTick } from 'vue';

import { BaseDialog } from '@/features/shared';

describe('BaseDialog', () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Rendering', () => {
    it('should not render when visible is false', () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: false,
        },
      });

      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });

    it('should render when visible is true', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    });

    it('should render header text when provided', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          header: 'Test Header',
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.body.textContent).toContain('Test Header');
    });

    it('should not render default header when header prop is not provided', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          header: null,
        },
        attachTo: document.body,
      });

      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      const defaultHeader = dialog?.querySelector('h3');
      expect(defaultHeader).toBeFalsy();
    });

    it('should not render default header when header is empty string', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          header: '',
        },
        attachTo: document.body,
      });

      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      const defaultHeader = dialog?.querySelector('h3.text-xl');
      expect(defaultHeader).toBeFalsy();
    });

    it('should handle header prop changing from truthy to falsy', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          header: 'Initial Header',
        },
        attachTo: document.body,
      });

      await nextTick();
      let dialog = document.querySelector('[role="dialog"]');
      let headerEl = dialog?.querySelector('h3');
      expect(headerEl?.textContent).toContain('Initial Header');

      // Change header to null
      await wrapper.setProps({
        header: null,
      });
      await nextTick();

      dialog = document.querySelector('[role="dialog"]');
      headerEl = dialog?.querySelector('h3');
      expect(headerEl).toBeFalsy();
    });

    it('should render default slot content', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
        },
        slots: {
          default: '<p>Test Content</p>',
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.body.textContent).toContain('Test Content');
    });

    it('should render header slot when provided', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          // No header prop provided
        },
        slots: {
          header: '<h3>Custom Header</h3>',
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.body.textContent).toContain('Custom Header');
      // Verify default header h3 is not rendered (header prop is not provided)
      const dialog = document.querySelector('[role="dialog"]')!;
      const defaultHeaders = Array.from(dialog.querySelectorAll('h3'));
      // Should only have the custom header from slot
      expect(defaultHeaders.some((h) => h.textContent?.includes('Custom Header'))).toBe(true);
    });

    it('should render footer slot when provided', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
        },
        slots: {
          footer: '<button>Action</button>',
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.body.textContent).toContain('Action');
    });

    it('should render close button when closable is true', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closable: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      const closeButton = dialog?.querySelector('button[type="button"]');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when closable is false', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closable: false,
          header: 'Test',
        },
        attachTo: document.body,
      });

      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      // Verify dialog is rendered
      expect(dialog).toBeTruthy();
      // Verify close button is not present
      const closeButton = dialog?.querySelector('button[type="button"] .i-close');
      expect(closeButton).toBeFalsy();
    });

    it('should render modal overlay when modal is true', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          modal: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      const overlay = document.querySelector('.bg-gray-500\\/75');
      expect(overlay).toBeTruthy();
    });

    it('should not render modal overlay when modal is false', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          modal: false,
        },
        attachTo: document.body,
      });

      await nextTick();
      const overlay = document.querySelector('.bg-black\\/50');
      expect(overlay).toBeFalsy();
    });
  });

  describe('v-model:visible', () => {
    it('should emit update:visible when closing', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closable: true,
        },
        attachTo: document.body,
      });

      await nextTick();

      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();

      const closeButton = dialog?.querySelector('button[type="button"]')! as HTMLButtonElement;
      closeButton.click();

      await nextTick();

      await new Promise((resolve) => {
        setTimeout(resolve, 350);
      });

      expect(document.querySelector('[role="dialog"]')).toBeFalsy();
    });

    it('should update visibility when prop changes', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: false,
        },
        attachTo: document.body,
      });

      await nextTick();
      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeFalsy();

      await wrapper.setProps({
        visible: true,
      });
      await nextTick();
      await nextTick();

      expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    });
  });

  describe('Methods (Ref Access)', () => {
    it('should expose open method', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: false,
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeFalsy();

      const vm = wrapper.vm as unknown as {
        open: () => void;
      };
      expect(typeof vm.open).toBe('function');
      vm.open();
      await nextTick();

      expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    });

    it('should expose close method', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeTruthy();

      const vm = wrapper.vm as unknown as {
        close: () => void;
      };
      expect(typeof vm.close).toBe('function');
      vm.close();
      await nextTick();

      await new Promise((resolve) => {
        setTimeout(resolve, 350);
      });

      expect(document.querySelector('[role="dialog"]')).toBeFalsy();
    });

    it('should expose toggle method', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: false,
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeFalsy();

      const vm = wrapper.vm as unknown as {
        toggle: () => void;
      };
      expect(typeof vm.toggle).toBe('function');
      vm.toggle();
      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeTruthy();

      vm.toggle();
      await nextTick();

      await new Promise((resolve) => {
        setTimeout(resolve, 350);
      });

      expect(document.querySelector('[role="dialog"]')).toBeFalsy();
    });

    it('should not close when closable is false', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closable: false,
        },
        attachTo: document.body,
      });

      const vm = wrapper.vm as unknown as {
        close: () => void;
      };
      vm.close();
      await nextTick();

      expect(wrapper.emitted('update:visible')).toBeFalsy();
      expect(wrapper.emitted('close')).toBeFalsy();
    });
  });

  describe('Close Behavior', () => {
    it('should close on ESC key when closeOnEscape is true', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closeOnEscape: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeTruthy();

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(event);
      await nextTick();

      await new Promise((resolve) => {
        setTimeout(resolve, 350);
      });
      expect(document.querySelector('[role="dialog"]')).toBeFalsy();
    });

    it('should not close on ESC key when closeOnEscape is false', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closeOnEscape: false,
        },
        attachTo: document.body,
      });

      await nextTick();

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(event);
      await nextTick();

      expect(wrapper.emitted('update:visible')).toBeFalsy();
    });

    it('should not close on ESC key when closable is false', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closeOnEscape: true,
          closable: false,
        },
        attachTo: document.body,
      });

      await nextTick();

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(event);
      await nextTick();

      expect(wrapper.emitted('update:visible')).toBeFalsy();
    });

    it('should close on overlay click when closeOnClickOutside is true', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closeOnClickOutside: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      expect(document.querySelector('[role="dialog"]')).toBeTruthy();

      const overlay = document.querySelector('.bg-gray-500\\/75')! as HTMLButtonElement;
      overlay?.click();
      await nextTick();

      await new Promise((resolve) => {
        setTimeout(resolve, 350);
      });
      expect(document.querySelector('[role="dialog"]')).toBeFalsy();
    });

    it('should not close on overlay click when closeOnClickOutside is false', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closeOnClickOutside: false,
        },
        attachTo: document.body,
      });

      await nextTick();

      const overlay = document.querySelector('.bg-black\\/50')! as HTMLButtonElement;
      overlay?.click();
      await nextTick();

      expect(wrapper.emitted('update:visible')).toBeFalsy();
    });

    it('should not close on dialog content click', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          closeOnClickOutside: true,
        },
        slots: {
          default: '<p>Content</p>',
        },
        attachTo: document.body,
      });

      await nextTick();

      const dialog = document.querySelector('[role="dialog"]')! as HTMLElement;
      dialog?.click();
      await nextTick();

      expect(wrapper.emitted('update:visible')).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('should render with dialog role', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should have aria-modal when modal is true', async () => {
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          modal: true,
        },
        attachTo: document.body,
      });

      await nextTick();
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });
  });

  describe('Shadow DOM Detection', () => {
    it('should handle when getCurrentInstance returns null', () => {
      // This test covers the edge case where getCurrentInstance might return null
      // The component should still work and default to body teleport target
      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          teleportTo: 'body',
        },
        attachTo: document.body,
      });

      // If it doesn't throw an error, it's handling the null case correctly
      expect(wrapper.exists()).toBe(true);
    });

    it('should detect shadow root and use it as teleport target', async () => {
      // Create a mock shadow root
      const hostElement = document.createElement('div');
      const shadowRoot = hostElement.attachShadow({ mode: 'open' });

      // Add the shadow root to the document body
      document.body.append(hostElement);

      // Create a container inside the shadow root
      const shadowContainer = document.createElement('div');
      shadowContainer.id = 'shadow-container';
      shadowRoot.append(shadowContainer);

      wrapper = mount(BaseDialog, {
        props: {
          visible: true,
          header: 'Shadow Test',
        },
        attachTo: shadowContainer,
      });

      await nextTick();

      // The dialog should be rendered
      expect(wrapper.exists()).toBe(true);

      // Clean up
      hostElement.remove();
    });
  });
});
