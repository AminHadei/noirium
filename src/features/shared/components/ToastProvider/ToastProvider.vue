<script setup lang="ts">
  import { computed, provide, ref } from 'vue';

  import { TOAST_INJECTION_KEY } from '../../lib/composables/use-toast';
  import type { Toast, ToastContextValue, ToastOptions } from '../../lib/types';
  import ToastContainer from '../ToastContainer/ToastContainer.vue';

  export interface ToastProviderProps {
    maxToasts?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }

  const props = withDefaults(defineProps<ToastProviderProps>(), {
    maxToasts: 6,
    position: 'top-right',
  });

  const toasts = ref<Toast[]>([]);
  let toastCounter = 0;

  const generateId = (): string => {
    toastCounter += 1;
    return `toast-${Date.now()}-${toastCounter}`;
  };

  const addToast = (options: ToastOptions): string => {
    const id = options.id ?? generateId();
    const newToast: Toast = {
      ...options,
      id,
      createdAt: Date.now(),
    };

    toasts.value.unshift(newToast);

    // Remove oldest toast if we exceed maxToasts
    if (toasts.value.length > props.maxToasts) {
      toasts.value.pop();
    }

    return id;
  };

  const removeToast = (id: string): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAll = (): void => {
    toasts.value = [];
  };

  const contextValue = computed<ToastContextValue>(() => ({
    toasts: toasts.value,
    addToast,
    removeToast,
    clearAll,
  }));

  // Provide reactive context
  provide(TOAST_INJECTION_KEY, contextValue);
</script>

<template>
  <div>
    <slot />
    <ToastContainer
      :toasts="toasts"
      :max-toasts="maxToasts"
      :position="position"
      @close="removeToast"
    />
  </div>
</template>
