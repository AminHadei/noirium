import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test';
import { nextTick } from 'vue';

import type { ToastType } from '@/entries/types';

import Toast from './Toast.vue';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders with required props', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test description',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain('Test description');
    });

    it('renders title when provided', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          title: 'Test Title',
          description: 'Test description',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.text()).toContain('Test Title');
      expect(wrapper.text()).toContain('Test description');
    });

    it('renders without title', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test description',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('h4').exists()).toBe(false);
      expect(wrapper.text()).toContain('Test description');
    });

    it('renders all toast types', async () => {
      const types = ['info', 'error', 'success', 'warning'] as const;
      const expectedIconBg: Record<(typeof types)[number], string> = {
        info: 'bg-status-blue',
        error: 'bg-status-red-strong',
        success: 'bg-status-green',
        warning: 'bg-status-yellow',
      };

      for (const type of types) {
        const wrapper = mount(Toast, {
          props: {
            id: `toast-${type}`,
            type,
            description: 'Test',
          },
        });

        await nextTick();
        vi.advanceTimersByTime(10);
        await nextTick();

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.classes()).toContain('bg-white');
        expect(wrapper.find('.size-5').classes()).toContain(expectedIconBg[type]);
      }
    });

    it('renders with title slot only', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
        },
        slots: {
          title: 'Slot Title',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.text()).toContain('Slot Title');
      expect(wrapper.find('h4').exists()).toBe(true);
    });

    it('renders with description slot only', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
        },
        slots: {
          description: 'Slot Description',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.text()).toContain('Slot Description');
    });

    it('renders with both title and description slots', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
        },
        slots: {
          title: 'Slot Title',
          description: 'Slot Description',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.text()).toContain('Slot Title');
      expect(wrapper.text()).toContain('Slot Description');
    });

    it('renders when hasContent is true via slots', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
        },
        slots: {
          title: 'Title',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it('handles default case in getIconClass with invalid type', async () => {
      // Test default case by using an invalid type that falls through to default
      // This tests the default branch and fallback behavior in computed properties
      // Using multiple invalid types to ensure the default case is hit
      const invalidTypes = ['invalid', 'unknown', 'bad-type', 'wrong'];

      for (const invalidType of invalidTypes) {
        const wrapper = mount(Toast, {
          props: {
            id: `toast-${invalidType}`,
            type: invalidType as ToastType,
            description: 'Test',
            closable: true,
          },
        });

        await nextTick();
        vi.advanceTimersByTime(10);
        await nextTick();

        // Ensure component is visible and rendered - this forces evaluation of all computed properties
        const toastElement = wrapper.find('[role="alert"]');
        expect(toastElement.exists()).toBe(true);

        // Verify the icon container exists and has the correct classes
        // This ensures getIconClass() is called and the default case is executed (line 107)
        const iconContainer = wrapper.find('.size-5');
        expect(iconContainer.exists()).toBe(true);

        // Default case should return info icon and use info styles
        // This tests the default branch in getIconClass switch statement (line 104-107)
        // The icon class is applied via getIconClass() in the template (line 161)
        expect(wrapper.find('.i-info-circle').exists()).toBe(true);

        // Verify icon container has the fallback background color
        // This ensures iconContainerClasses computed property used the fallback
        expect(iconContainer.classes()).toContain('bg-status-blue');

        // Test all computed properties use fallback to info styles
        // This tests all three nullish coalescing operators (??) fallback branches:
        // - toastClasses[props.type] ?? toastClasses.info (line 58)
        // - typeCloseClasses[props.type] ?? typeCloseClasses.info (line 78)
        // - typeIconBgClasses[props.type] ?? typeIconBgClasses.info (line 91)
        // toast surface stays monochrome for invalid types
        expect(wrapper.classes()).toContain('bg-white');
        const closeButton = wrapper.find('button[aria-label="Close toast"]');
        expect(closeButton.exists()).toBe(true);
        expect(closeButton.classes()).toContain('text-text-dark');

        expect(toastElement.classes()).toContain('bg-white');

        // Verify the HTML contains the icon class to ensure getIconClass() was executed
        const html = wrapper.html();
        expect(html).toContain('i-info-circle');

        wrapper.unmount();
      }
    });
  });

  describe('Icons', () => {
    it('displays correct icon for info type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('.i-info-circle').exists()).toBe(true);
    });

    it('displays correct icon for error type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'error',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('.i-x-circle').exists()).toBe(true);
    });

    it('displays correct icon for success type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'success',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('.i-check-circle').exists()).toBe(true);
    });

    it('displays correct icon for warning type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'warning',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('.i-alert-triangle').exists()).toBe(true);
    });
  });

  describe('Close Button', () => {
    it('shows close button when closable is true', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
          closable: true,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const closeButton = wrapper.find('button[aria-label="Close toast"]');
      expect(closeButton.exists()).toBe(true);
    });

    it('hides close button when closable is false', () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
          closable: false,
        },
      });

      const closeButton = wrapper.find('button[aria-label="Close toast"]');
      expect(closeButton.exists()).toBe(false);
    });

    it('emits close event when close button is clicked', async () => {
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template:
          '<Toast id="toast-1" type="info" description="Test" :closable="true" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const toastComponent = wrapper.findComponent({
        name: 'BaseToast',
      });
      expect(toastComponent.exists()).toBe(true);

      const closeButton = toastComponent.find('button[aria-label="Close toast"]');
      expect(closeButton.exists()).toBe(true);

      await closeButton.trigger('click');
      await nextTick();
      // Extra tick to ensure emit is captured
      await nextTick();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith('toast-1');
    });

    it('clears timeout when close button is clicked', async () => {
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template:
          '<Toast id="toast-1" type="info" description="Test" :duration="5000" :closable="true" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const toastComponent = wrapper.findComponent({
        name: 'BaseToast',
      });
      const closeButton = toastComponent.find('button[aria-label="Close toast"]');

      // Click close before timeout expires - this should clear the timeout
      await closeButton.trigger('click');
      await nextTick();

      // Advance time past the duration - toast should not auto-close since we already closed it
      vi.advanceTimersByTime(5000);
      await nextTick();

      // Should only be called once (from the manual close)
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not emit close when closable is false', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
          closable: false,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      // Component doesn't expose handleClose, and closable is false so no close button exists
      // This test verifies that when closable is false, no close functionality is available
      const closeButton = wrapper.find('button[aria-label="Close toast"]');
      expect(closeButton.exists()).toBe(false);
      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('auto-closes even when closable is false', async () => {
      // Test that closable only affects button visibility, not auto-close behavior
      // Auto-close should work regardless of closable value
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template:
          '<Toast id="toast-1" type="info" description="Test" :closable="false" :duration="5000" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      // Verify close button is not visible when closable is false
      const toastComponent = wrapper.findComponent({
        name: 'BaseToast',
      });
      const closeButton = toastComponent.find('button[aria-label="Close toast"]');
      expect(closeButton.exists()).toBe(false);

      // Advance past duration - auto-close should work even though closable is false
      vi.advanceTimersByTime(5000);
      await nextTick();
      await nextTick();

      // Should emit close because auto-close works regardless of closable
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith('toast-1');
    });
  });

  describe('Auto-close', () => {
    it('auto-closes after default duration', async () => {
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template:
          '<Toast id="toast-1" type="info" description="Test" :duration="5000" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const toastComponent = wrapper.findComponent({
        name: 'BaseToast',
      });
      expect(toastComponent.exists()).toBe(true);

      // Advance past duration (5000ms) - this triggers handleClose
      // handleClose emits immediately and sets isVisible to false
      vi.advanceTimersByTime(5000);
      await nextTick();
      // Extra tick to ensure emit is captured
      await nextTick();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith('toast-1');
    });

    it('does not auto-close when duration is 0', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
          duration: 0,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10000);
      await nextTick();

      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('auto-closes with default duration when duration is not provided', async () => {
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template: '<Toast id="toast-1" type="info" description="Test" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);
      expect(wrapper.exists()).toBe(true);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      // Duration defaults to 5000, so it should auto-close after 5000ms
      vi.advanceTimersByTime(5000);
      await nextTick();
      await nextTick();

      // Should have emitted close event
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not auto-close when duration is undefined', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10000);
      await nextTick();

      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('does not auto-close when duration is negative', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
          duration: -1000,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10000);
      await nextTick();

      // Negative duration should not trigger auto-close
      // This tests the branch where props.duration is truthy but props.duration > 0 is false
      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('uses custom duration', async () => {
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template:
          '<Toast id="toast-1" type="info" description="Test" :duration="2000" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const toastComponent = wrapper.findComponent({
        name: 'BaseToast',
      });
      expect(toastComponent.exists()).toBe(true);

      // Advance past duration (2000ms) - this triggers handleClose
      // handleClose emits immediately and sets isVisible to false
      vi.advanceTimersByTime(2000);
      await nextTick();
      await nextTick();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith('toast-1');
    });

    it('auto-closes when closable is false', async () => {
      // Test that closable prop does not affect auto-close behavior
      // Auto-close should work regardless of closable value
      const onClose = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          Toast,
        },
        template:
          '<Toast id="toast-1" type="info" description="Test" :closable="false" :duration="3000" @close="onClose" />',
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const toastComponent = wrapper.findComponent({
        name: 'BaseToast',
      });
      expect(toastComponent.exists()).toBe(true);

      // Advance past duration - auto-close should work even when closable is false
      vi.advanceTimersByTime(3000);
      await nextTick();
      await nextTick();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith('toast-1');
    });
  });

  describe('Transitions', () => {
    it('applies enter transition', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('.toast-enter-active').exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct role attribute', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it('has assertive aria-live for error type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'error',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.find('[aria-live="assertive"]').exists()).toBe(true);
    });

    it('has polite aria-live for non-error types', async () => {
      const types = ['info', 'success', 'warning'] as const;

      for (const type of types) {
        const wrapper = mount(Toast, {
          props: {
            id: `toast-${type}`,
            type,
            description: 'Test',
          },
        });

        await nextTick();
        vi.advanceTimersByTime(10);
        await nextTick();

        expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true);
      }
    });
  });

  describe('CSS Classes', () => {
    it('applies correct classes for info type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'info',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.classes()).toContain('bg-white');
      expect(wrapper.classes()).toContain('border');
      expect(wrapper.find('.size-5').classes()).toContain('bg-status-blue');
    });

    it('applies correct classes for error type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'error',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.classes()).toContain('bg-white');
      expect(wrapper.classes()).toContain('border');
      expect(wrapper.find('.size-5').classes()).toContain('bg-status-red-strong');
    });

    it('applies correct classes for success type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'success',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.classes()).toContain('bg-white');
      expect(wrapper.classes()).toContain('border');
      expect(wrapper.find('.size-5').classes()).toContain('bg-status-green');
    });

    it('applies correct classes for warning type', async () => {
      const wrapper = mount(Toast, {
        props: {
          id: 'toast-1',
          type: 'warning',
          description: 'Test',
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.classes()).toContain('bg-white');
      expect(wrapper.classes()).toContain('border');
      expect(wrapper.find('.size-5').classes()).toContain('bg-status-yellow');
    });
  });
});
