<script setup lang="ts">
  import { computed, onMounted, ref, toRefs, useSlots } from 'vue';

  import type { ToastType } from '../../lib/types';

  defineOptions({
    name: 'BaseToast',
  });

  export type ToastProps = {
    id: string;
    type: ToastType;
    title?: string;
    description?: string;
    duration?: number;
    closable?: boolean;
  };

  const props = withDefaults(defineProps<ToastProps>(), {
    title: '',
    description: '',
    closable: true,
    duration: 5000,
  });

  const emit = defineEmits<{
    close: [id: string];
  }>();

  const slots: ReturnType<typeof useSlots> = useSlots();
  const propsRefs = toRefs(props);

  const isVisible = ref(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const toastClasses = computed(() => {
    const base = [
      ':uno: flex',
      ':uno: items-center',
      ':uno: gap-3',
      ':uno: px-4',
      ':uno: py-3',
      ':uno: rounded-[12px]',
      ':uno: border-1',
      ':uno: min-w-[320px]',
      ':uno: max-w-[420px]',
      ':uno: transition-all',
      ':uno: duration-300',
      ':uno: ease-in-out',
    ];

    const surfaceClasses = [':uno: bg-white', ':uno: border-border'];

    return [...base, ...surfaceClasses];
  });

  const closeButtonClasses = computed(() => {
    const base = [
      ':uno: flex',
      ':uno: items-center',
      ':uno: cursor-pointer',
      ':uno: transition-colors',
      ':uno: duration-200',
      ':uno: hover:opacity-70',
    ];

    return [...base, ':uno: text-text-dark'];
  });

  const iconContainerClasses = computed(() => {
    const base = [
      ':uno: flex',
      ':uno: items-center',
      ':uno: justify-center',
      ':uno: size-5',
      ':uno: rounded-full',
      ':uno: flex-shrink-0',
      ':uno: text-white',
    ];

    const typeIconBgClasses: Record<ToastType, string[]> = {
      info: [':uno: bg-status-blue'],
      error: [':uno: bg-status-red-strong'],
      success: [':uno: bg-status-green'],
      warning: [':uno: bg-status-yellow'],
    };

    return [...base, ...(typeIconBgClasses[props.type] ?? typeIconBgClasses.info)];
  });

  const getIconClass = (): string => {
    switch (props.type) {
      case 'info':
        return ':uno: i-info-circle';
      case 'error':
        return ':uno: i-x-circle';
      case 'success':
        return ':uno: i-check-circle';
      case 'warning':
        return ':uno: i-alert-triangle';
      default:
        // Runtime fallback for invalid types (unreachable with TypeScript but possible at runtime)
        // This branch is tested via invalid type assertion in tests
        return ':uno: i-info-circle';
    }
  };

  const hasContent = computed<boolean>(() => {
    return !!(
      slots['title'] ||
      slots['description'] ||
      propsRefs['title'].value ||
      propsRefs['description'].value
    );
  });

  const hasTitleSlot = computed(() => !!slots['title']);
  const hasDescriptionSlot = computed(() => !!slots['description']);

  const handleClose = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    const toastId = props.id;

    /* @unocss-skip-start */
    // Emit close event immediately, then hide after transition
    // This ensures the event is emitted even if component unmounts
    /* @unocss-skip-end */
    emit('close', toastId);

    isVisible.value = false;
  };

  onMounted(() => {
    // Trigger enter animation
    setTimeout(() => {
      isVisible.value = true;
    }, 10);

    // Auto-close if duration is set and > 0
    if (props.duration && props.duration > 0) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, props.duration);
    }
  });
</script>

<template>
  <Transition name="toast">
    <div
      v-if="isVisible && hasContent"
      :class="toastClasses"
      class=":uno: toast-container"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <!-- Status Icon -->
      <div :class="[...iconContainerClasses, getIconClass()]" />

      <!-- Content -->
      <div class=":uno: flex flex-1 flex-col gap-1">
        <h4
          v-if="hasTitleSlot || title"
          class=":uno: text-text-darker text-sm font-semibold"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </h4>
        <p
          v-if="hasDescriptionSlot || description"
          class=":uno: text-text-dark m-0 text-sm"
        >
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </div>

      <div v-if="closable">
        <!-- Close Button -->
        <button
          type="button"
          :class="closeButtonClasses"
          aria-label="Close toast"
          @click="handleClose"
        >
          <span class=":uno: i-close size-5" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  /* @unocss-skip-start */
  .toast-container {
    box-shadow: 0px 8px 14px 0px #0000001f;
  }

  .toast-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-enter-to,
  .toast-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  /* @unocss-skip-end */
</style>
