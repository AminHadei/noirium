import { inject, computed, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue';

import type { Toast, ToastContextValue, ToastOptions } from '../types';

export const TOAST_INJECTION_KEY: InjectionKey<ComputedRef<ToastContextValue>> = Symbol('toast');

export function useToast(): ToastContextValue {
  const context = inject(TOAST_INJECTION_KEY);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context.value;
}

export function useToastOrNull(): ToastContextValue | null {
  const context = inject(TOAST_INJECTION_KEY, null);
  return context ? context.value : null;
}

const MAX_STANDALONE_TOASTS = 6;

// Convenience functions for each toast type
export function createToastHelpers(context: ToastContextValue): ToastHelpers {
  return {
    info: (options: Omit<ToastOptions, 'type'>): string => {
      return context.addToast({
        ...options,
        type: 'info',
      });
    },
    error: (options: Omit<ToastOptions, 'type'>): string => {
      return context.addToast({
        ...options,
        type: 'error',
      });
    },
    success: (options: Omit<ToastOptions, 'type'>): string => {
      return context.addToast({
        ...options,
        type: 'success',
      });
    },
    warning: (options: Omit<ToastOptions, 'type'>): string => {
      return context.addToast({
        ...options,
        type: 'warning',
      });
    },
    remove: (id: string): void => {
      context.removeToast(id);
    },
    clearAll: (): void => {
      context.clearAll();
    },
  };
}

/**
 * Use toast when provided by ToastProvider, or fall back to a local standalone toast
 * (e.g. in web component / Shadow DOM). Use for components that must work with or without a provider.
 * Returns helpers to show toasts and, when no provider is present, refs to render a ToastContainer.
 */
export function useToastOptional(): {
  toast: ComputedRef<ToastHelpers | null>;
  showStandaloneContainer: ComputedRef<boolean>;
  standaloneToasts: Ref<Toast[]>;
  removeStandaloneToast: (id: string) => void;
} {
  const injectedRef = inject(TOAST_INJECTION_KEY, null);
  const standaloneToasts = ref<Toast[]>([]);
  let standaloneCounter = 0;

  const addStandaloneToast = (options: ToastOptions): string => {
    standaloneCounter += 1;
    const id = options.id ?? `toast-${Date.now()}-${standaloneCounter}`;
    standaloneToasts.value = [
      { ...options, id, createdAt: Date.now() },
      ...standaloneToasts.value,
    ].slice(0, MAX_STANDALONE_TOASTS);
    return id;
  };

  const removeStandaloneToast = (id: string): void => {
    const i = standaloneToasts.value.findIndex((t) => t.id === id);
    if (i > -1) standaloneToasts.value.splice(i, 1);
  };

  const standaloneContext: ToastContextValue = {
    get toasts(): Toast[] {
      return standaloneToasts.value;
    },
    addToast: addStandaloneToast,
    removeToast: removeStandaloneToast,
    clearAll: () => {
      standaloneToasts.value = [];
    },
  };

  const activeContext = computed<ToastContextValue>(() => injectedRef?.value ?? standaloneContext);
  const toast = computed<ToastHelpers | null>(() => createToastHelpers(activeContext.value));
  const showStandaloneContainer = computed(() => injectedRef === null);

  return {
    toast,
    showStandaloneContainer,
    standaloneToasts,
    removeStandaloneToast,
  };
}

// Type for toast helper functions
export type ToastHelpers = {
  info: (options: Omit<ToastOptions, 'type'>) => string;
  error: (options: Omit<ToastOptions, 'type'>) => string;
  success: (options: Omit<ToastOptions, 'type'>) => string;
  warning: (options: Omit<ToastOptions, 'type'>) => string;
  remove: (id: string) => void;
  clearAll: () => void;
};
