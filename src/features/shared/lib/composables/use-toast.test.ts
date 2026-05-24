import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import ToastProvider from '../../components/ToastProvider/ToastProvider.vue';
import type { ToastContextValue, ToastOptions } from '../types';
import { createToastHelpers, useToast, useToastOptional, useToastOrNull } from './use-toast';

describe('useToast', () => {
  const createMockContext = (): ToastContextValue => {
    const toasts: ToastContextValue['toasts'] = [];

    return {
      toasts,
      addToast: (options: ToastOptions): string => {
        const id = `toast-${Date.now()}`;
        toasts.push({
          ...options,
          id,
          createdAt: Date.now(),
        });
        return id;
      },
      removeToast: (id: string): void => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index > -1) {
          toasts.splice(index, 1);
        }
      },
      clearAll: (): void => {
        toasts.length = 0;
      },
    };
  };

  describe('createToastHelpers', () => {
    it('creates helper functions for all toast types', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      expect(helpers.info).toBeDefined();
      expect(helpers.error).toBeDefined();
      expect(helpers.success).toBeDefined();
      expect(helpers.warning).toBeDefined();
      expect(helpers.remove).toBeDefined();
      expect(helpers.clearAll).toBeDefined();
    });

    it('info helper adds info toast', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      const id = helpers.info({
        title: 'Info',
        description: 'Info message',
      });

      expect(id).toBeDefined();
      expect(context.toasts.length).toBe(1);
      expect(context.toasts[0]?.type).toBe('info');
      expect(context.toasts[0]?.title).toBe('Info');
      expect(context.toasts[0]?.description).toBe('Info message');
    });

    it('error helper adds error toast', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      const id = helpers.error({
        title: 'Error',
        description: 'Error message',
      });

      expect(id).toBeDefined();
      expect(context.toasts.length).toBe(1);
      expect(context.toasts[0]?.type).toBe('error');
    });

    it('success helper adds success toast', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      const id = helpers.success({
        title: 'Success',
        description: 'Success message',
      });

      expect(id).toBeDefined();
      expect(context.toasts.length).toBe(1);
      expect(context.toasts[0]?.type).toBe('success');
    });

    it('warning helper adds warning toast', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      const id = helpers.warning({
        title: 'Warning',
        description: 'Warning message',
      });

      expect(id).toBeDefined();
      expect(context.toasts.length).toBe(1);
      expect(context.toasts[0]?.type).toBe('warning');
    });

    it('remove helper removes toast', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      const id = helpers.info({
        description: 'Test',
      });
      expect(context.toasts.length).toBe(1);

      helpers.remove(id);
      expect(context.toasts.length).toBe(0);
    });

    it('clearAll helper clears all toasts', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      helpers.info({
        description: 'Test 1',
      });
      helpers.success({
        description: 'Test 2',
      });
      helpers.error({
        description: 'Test 3',
      });

      expect(context.toasts.length).toBe(3);

      helpers.clearAll();
      expect(context.toasts.length).toBe(0);
    });

    it('helpers work with optional props', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      helpers.info({
        description: 'No title',
      });
      expect(context.toasts.length).toBe(1);
      expect(context.toasts[0]?.title).toBeUndefined();
      expect(context.toasts[0]?.description).toBe('No title');
    });

    it('helpers support custom duration', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      helpers.info({
        description: 'Test',
        duration: 2000,
      });

      expect(context.toasts[0]?.duration).toBe(2000);
    });

    it('helpers support closable option', () => {
      const context = createMockContext();
      const helpers = createToastHelpers(context);

      helpers.info({
        description: 'Test',
        closable: false,
      });

      expect(context.toasts[0]?.closable).toBe(false);
    });
  });

  describe('useToastOrNull', () => {
    it('returns toast context when provider exists', () => {
      const toastInstances: (ToastContextValue | null)[] = [];

      const TestChild = {
        setup(): object {
          const toast = useToastOrNull();
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

      expect(wrapper.exists()).toBe(true);
      expect(toastInstances[0]).not.toBeNull();
      expect(toastInstances[0]).toHaveProperty('addToast');
      expect(toastInstances[0]).toHaveProperty('removeToast');
      expect(toastInstances[0]).toHaveProperty('clearAll');
    });

    it('returns null when provider does not exist', () => {
      const toastInstances: (ToastContextValue | null)[] = [];

      const TestComponent = {
        setup(): object {
          const toast = useToastOrNull();
          toastInstances.push(toast);
          return {};
        },
        template: '<div>Test</div>',
      };

      mount(TestComponent);

      expect(toastInstances[0]).toBeNull();
    });
  });

  describe('useToast', () => {
    it('returns context when provider exists', () => {
      const captured: ToastContextValue[] = [];

      const TestChild = {
        setup(): object {
          captured.push(useToast());
          return {};
        },
        template: '<div />',
      };

      mount(ToastProvider, { slots: { default: TestChild } });
      expect(captured[0]).toHaveProperty('addToast');
    });

    it('throws when no provider', () => {
      const TestComponent = {
        setup(): object {
          useToast();
          return {};
        },
        template: '<div />',
      };

      expect(() => mount(TestComponent)).toThrow(/ToastProvider/);
    });
  });

  describe('useToastOptional standalone', () => {
    interface OptionalReturn {
      toast: { value: { info: (o: ToastOptions) => string; clearAll: () => void } | null };
      showStandaloneContainer: { value: boolean };
      standaloneToasts: { value: { id: string }[] };
      removeStandaloneToast: (id: string) => void;
    }

    const setup = (): OptionalReturn => {
      let captured: OptionalReturn | null = null;
      const TestComponent = {
        setup(): object {
          captured = useToastOptional() as unknown as OptionalReturn;
          return {};
        },
        template: '<div />',
      };
      mount(TestComponent);
      return captured!;
    };

    it('flags standalone container when no provider exists', () => {
      const r = setup();
      expect(r.showStandaloneContainer.value).toBe(true);
    });

    it('adds, removes, and clears standalone toasts', () => {
      const r = setup();
      const id1 = r.toast.value!.info({ description: 'a', type: 'error' });
      const id2 = r.toast.value!.info({ description: 'b', type: 'success' });

      expect(r.standaloneToasts.value.length).toBe(2);
      expect(r.standaloneToasts.value[0]?.id).toBe(id2); // newest first

      r.removeStandaloneToast(id1);
      expect(r.standaloneToasts.value.length).toBe(1);

      r.toast.value!.clearAll();
      expect(r.standaloneToasts.value.length).toBe(0);
    });

    it('caps standalone toasts at MAX_STANDALONE_TOASTS', () => {
      const r = setup();
      for (let i = 0; i < 10; i += 1) {
        r.toast.value!.info({ description: `t${i}`, type: 'info' });
      }
      expect(r.standaloneToasts.value.length).toBe(6);
    });

    it('respects provided id when adding standalone', () => {
      const r = setup();
      const id = r.toast.value!.info({ id: 'custom', description: 'x', type: 'info' });
      expect(id).toBe('custom');
    });

    it('does not throw when removing unknown standalone id', () => {
      const r = setup();
      expect(() => {
        r.removeStandaloneToast('missing');
      }).not.toThrow();
    });
  });
});
