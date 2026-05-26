<script setup lang="ts">
  import { computed } from 'vue';

  import type { Toast as ToastType } from '../../lib/types';
  import Toast from '../Toast/Toast.vue';

  export interface ToastContainerProps {
    toasts: ToastType[];
    maxToasts?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }

  const props = withDefaults(defineProps<ToastContainerProps>(), {
    maxToasts: 6,
    position: 'top-right',
  });

  const emit = defineEmits<{
    close: [id: string];
  }>();

  const containerClasses = computed(() => {
    const base = [
      ':uno: fixed',
      ':uno: z-[100001]',
      ':uno: flex',
      ':uno: flex-col',
      ':uno: gap-3',
      ':uno: pointer-events-none',
    ];

    const positionClasses = {
      'top-right': [':uno: top-4', ':uno: right-4'],
      'top-left': [':uno: top-4', ':uno: left-4'],
      'bottom-right': [':uno: bottom-4', ':uno: right-4'],
      'bottom-left': [':uno: bottom-4', ':uno: left-4'],
    };

    return [...base, ...positionClasses[props.position]];
  });

  const displayedToasts = computed(() => {
    // Show most recent toasts up to maxToasts (newest first)
    return props.toasts.slice(0, props.maxToasts);
  });

  const handleClose = (id: string): void => {
    emit('close', id);
  };
</script>

<template>
  <div
    :class="containerClasses"
    role="status"
    aria-label="Toast notifications"
  >
    <Toast
      v-for="toast in displayedToasts"
      :id="toast.id"
      :key="toast.id"
      :type="toast.type"
      v-bind="{
        ...(toast.title !== undefined && { title: toast.title }),
        ...(toast.description !== undefined && { description: toast.description }),
        ...(toast.duration !== undefined && { duration: toast.duration }),
        ...(toast.closable !== undefined && { closable: toast.closable }),
      }"
      class=":uno: pointer-events-auto"
      @close="handleClose"
    />
  </div>
</template>
