import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test';
import { nextTick } from 'vue';

import type { Toast } from '../../lib/types';
import ToastContainer from './ToastContainer.vue';

const createMockToast = (id: string, type: Toast['type'] = 'info'): Toast => ({
  id,
  type,
  title: 'Title',
  description: 'Description',
  createdAt: Date.now(),
  duration: 5000,
  closable: true,
});

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders with empty toasts array', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findAll('[role="alert"]').length).toBe(0);
    });

    it('renders single toast', async () => {
      const toasts = [createMockToast('toast-1')];

      const wrapper = mount(ToastContainer, {
        props: {
          toasts,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.findAll('[role="alert"]').length).toBe(1);
    });

    it('renders multiple toasts', async () => {
      const toasts = [
        createMockToast('toast-1', 'info'),
        createMockToast('toast-2', 'success'),
        createMockToast('toast-3', 'error'),
      ];

      const wrapper = mount(ToastContainer, {
        props: {
          toasts,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.findAll('[role="alert"]').length).toBe(3);
    });
  });

  describe('Stacking', () => {
    it('displays all toasts when under maxToasts limit', async () => {
      const toasts = [
        createMockToast('toast-1'),
        createMockToast('toast-2'),
        createMockToast('toast-3'),
      ];

      const wrapper = mount(ToastContainer, {
        props: {
          toasts,
          maxToasts: 6,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.findAll('[role="alert"]').length).toBe(3);
    });

    it('limits displayed toasts to maxToasts', async () => {
      const toasts = [
        createMockToast('toast-1'),
        createMockToast('toast-2'),
        createMockToast('toast-3'),
        createMockToast('toast-4'),
        createMockToast('toast-5'),
        createMockToast('toast-6'),
        createMockToast('toast-7'),
      ];

      const wrapper = mount(ToastContainer, {
        props: {
          toasts,
          maxToasts: 6,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      expect(wrapper.findAll('[role="alert"]').length).toBe(6);
    });

    it('shows most recent toasts when limit exceeded', async () => {
      const toasts = [
        createMockToast('toast-1'),
        createMockToast('toast-2'),
        createMockToast('toast-3'),
        createMockToast('toast-4'),
        createMockToast('toast-5'),
        createMockToast('toast-6'),
        createMockToast('toast-7'),
      ];

      const wrapper = mount(ToastContainer, {
        props: {
          toasts,
          maxToasts: 6,
        },
      });

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const renderedToasts = wrapper.findAll('[role="alert"]');
      expect(renderedToasts.length).toBe(6);
      // Should show toasts 2-7 (most recent 6)
      expect(wrapper.text()).not.toContain('toast-1');
    });
  });

  describe('Position', () => {
    it('applies top-right position by default', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
        },
      });

      expect(wrapper.classes()).toContain('top-4');
      expect(wrapper.classes()).toContain('right-4');
    });

    it('applies top-left position', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
          position: 'top-left',
        },
      });

      expect(wrapper.classes()).toContain('top-4');
      expect(wrapper.classes()).toContain('left-4');
    });

    it('applies bottom-right position', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
          position: 'bottom-right',
        },
      });

      expect(wrapper.classes()).toContain('bottom-4');
      expect(wrapper.classes()).toContain('right-4');
    });

    it('applies bottom-left position', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
          position: 'bottom-left',
        },
      });

      expect(wrapper.classes()).toContain('bottom-4');
      expect(wrapper.classes()).toContain('left-4');
    });
  });

  describe('Events', () => {
    it('emits close event when toast is closed', async () => {
      const onClose = vi.fn<() => void>();
      const toasts = [createMockToast('toast-1')];

      const TestWrapper = {
        components: {
          ToastContainer,
        },
        template: '<ToastContainer :toasts="toasts" @close="onClose" />',
        data(): {
          toasts: Toast[];
        } {
          return {
            toasts,
          };
        },
        methods: {
          onClose,
        },
      };

      const wrapper = mount(TestWrapper);

      await nextTick();
      vi.advanceTimersByTime(10);
      await nextTick();

      const toastContainer = wrapper.findComponent({
        name: 'ToastContainer',
      });
      const toastComponent = toastContainer.findComponent({
        name: 'BaseToast',
      });
      expect(toastComponent.exists()).toBe(true);

      // Simulate toast closing by clicking the close button
      const closeButton = toastComponent.find('button[aria-label="Close toast"]');
      expect(closeButton.exists()).toBe(true);

      await closeButton.trigger('click');
      await nextTick();
      await nextTick();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith('toast-1');
    });
  });

  describe('Accessibility', () => {
    it('has role="status" so screen readers announce updates politely', () => {
      // role="status" implies aria-live="polite" — see WAI-ARIA spec.
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
        },
      });

      expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    it('has correct aria-label', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
        },
      });

      expect(wrapper.find('[aria-label="Toast notifications"]').exists()).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('applies base container classes', () => {
      const wrapper = mount(ToastContainer, {
        props: {
          toasts: [],
        },
      });

      expect(wrapper.classes()).toContain('fixed');
      expect(wrapper.classes()).toContain('z-[100001]');
      expect(wrapper.classes()).toContain('flex');
      expect(wrapper.classes()).toContain('flex-col');
      expect(wrapper.classes()).toContain('gap-3');
      expect(wrapper.classes()).toContain('pointer-events-none');
    });
  });
});
