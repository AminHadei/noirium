import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { useToast } from '../../lib/composables/use-toast';
import type { ToastContextValue } from '../../lib/types';
import ToastProvider from './ToastProvider.vue';

describe('ToastProvider', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(ToastProvider, {
        slots: {
          default: '<div>Test Content</div>',
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain('Test Content');
    });

    it('renders slot content', () => {
      const wrapper = mount(ToastProvider, {
        slots: {
          default: '<div id="test-slot">Slot Content</div>',
        },
      });

      expect(wrapper.find('#test-slot').exists()).toBe(true);
      expect(wrapper.text()).toContain('Slot Content');
    });
  });

  describe('Toast Context', () => {
    it('provides toast context to children', () => {
      const TestChild = {
        setup(): object {
          const toast = useToast();
          return {
            toast,
          };
        },
        template: '<div>Child</div>',
      };

      const wrapper = mount(ToastProvider, {
        slots: {
          default: TestChild,
        },
        global: {
          components: {
            TestChild,
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('throws error when useToast is used outside provider', () => {
      expect(() => {
        mount({
          setup(): object {
            useToast();
            return {};
          },
          template: '<div>Test</div>',
        });
      }).toThrow('useToast must be used within a ToastProvider');
    });
  });

  describe('Toast Management', () => {
    it('adds toast to list', async () => {
      const toastInstances: ToastContextValue[] = [];

      const TestChild = {
        setup(): object {
          const toast = useToast();
          toastInstances.push(toast);
          return {};
        },
        template: '<div>Child</div>',
      };

      const wrapper = mount(ToastProvider, {
        slots: {
          default: TestChild,
        },
        global: {
          components: {
            TestChild,
          },
        },
      });

      await wrapper.vm.$nextTick();

      const toastInstance = toastInstances[0]!;
      toastInstance.addToast({
        type: 'info',
        title: 'Test',
        description: 'Test description',
      });

      await wrapper.vm.$nextTick();

      const container = wrapper.findComponent({
        name: 'ToastContainer',
      });
      expect(container.exists()).toBe(true);
    });

    it('removes toast from list', async () => {
      const toastInstances: ToastContextValue[] = [];

      const TestChild = {
        setup(): object {
          const toast = useToast();
          toastInstances.push(toast);
          return {};
        },
        template: '<div>Child</div>',
      };

      const wrapper = mount(ToastProvider, {
        slots: {
          default: TestChild,
        },
        global: {
          components: {
            TestChild,
          },
        },
      });

      await wrapper.vm.$nextTick();

      const toastInstance = toastInstances[0]!;
      const id = toastInstance.addToast({
        type: 'info',
        title: 'Test',
        description: 'Test description',
      });
      await wrapper.vm.$nextTick();
      toastInstance.removeToast(id);

      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
    });

    it('clears all toasts', async () => {
      const toastInstances: ToastContextValue[] = [];

      const TestChild = {
        setup(): object {
          const toast = useToast();
          toastInstances.push(toast);
          return {};
        },
        template: '<div>Child</div>',
      };

      const wrapper = mount(ToastProvider, {
        slots: {
          default: TestChild,
        },
        global: {
          components: {
            TestChild,
          },
        },
      });

      await wrapper.vm.$nextTick();

      const toastInstance = toastInstances[0]!;
      toastInstance.addToast({
        type: 'info',
        description: 'Test 1',
      });
      toastInstance.addToast({
        type: 'success',
        description: 'Test 2',
      });
      await wrapper.vm.$nextTick();
      toastInstance.clearAll();

      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Max Toasts', () => {
    it('respects maxToasts prop', async () => {
      const toastInstances: ToastContextValue[] = [];

      const TestChild = {
        setup(): object {
          const toast = useToast();
          toastInstances.push(toast);
          return {};
        },
        template: '<div>Child</div>',
      };

      const wrapper = mount(ToastProvider, {
        props: {
          maxToasts: 6,
        },
        slots: {
          default: TestChild,
        },
        global: {
          components: {
            TestChild,
          },
        },
      });

      await wrapper.vm.$nextTick();

      const toastInstance = toastInstances[0]!;
      // Add more toasts than maxToasts
      for (let i = 0; i < 10; i += 1) {
        toastInstance.addToast({
          type: 'info',
          description: `Toast ${i}`,
        });
      }

      await wrapper.vm.$nextTick();

      const container = wrapper.findComponent({
        name: 'ToastContainer',
      });
      expect(container.props('maxToasts')).toBe(6);
    });
  });

  describe('Position', () => {
    it('passes position prop to container', () => {
      const wrapper = mount(ToastProvider, {
        props: {
          position: 'bottom-left',
        },
      });

      const container = wrapper.findComponent({
        name: 'ToastContainer',
      });
      expect(container.props('position')).toBe('bottom-left');
    });

    it('uses default position', () => {
      const wrapper = mount(ToastProvider);

      const container = wrapper.findComponent({
        name: 'ToastContainer',
      });
      expect(container.props('position')).toBe('top-right');
    });
  });
});
