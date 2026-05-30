<script setup lang="ts">
  import { useModalContext } from 'noirium/ui';
  import { computed } from 'vue';

  type ConfirmTone = 'danger' | 'warning' | 'info';

  interface Props {
    tone?: ConfirmTone;
    confirmLabel?: string;
    cancelLabel?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    tone: 'info',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  });

  const emit = defineEmits<{ confirm: []; cancel: [] }>();

  defineOptions({ name: 'ConfirmLayout', inheritAttrs: false });

  const { title, requestClose } = useModalContext();

  const tones: Record<ConfirmTone, { ring: string; btn: string; icon: string }> = {
    danger: {
      ring: 'bg-neutral-200 text-neutral-900',
      btn: 'bg-neutral-900 hover:bg-neutral-800',
      icon: '⚠',
    },
    warning: {
      ring: 'bg-neutral-100 text-neutral-700',
      btn: 'bg-neutral-700 hover:bg-neutral-800',
      icon: '!',
    },
    info: {
      ring: 'bg-neutral-100 text-neutral-600',
      btn: 'bg-neutral-600 hover:bg-neutral-700',
      icon: 'i',
    },
  };

  const tone = computed(() => tones[props.tone]);

  const onBackdropClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) requestClose();
  };

  const onConfirm = (): void => {
    emit('confirm');
    requestClose();
  };

  const onCancel = (): void => {
    emit('cancel');
    requestClose();
  };
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 100001"
    @click="onBackdropClick"
  >
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
      <div
        :class="[
          'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold',
          tone.ring,
        ]"
      >
        {{ tone.icon }}
      </div>

      <h3 class="m-0 text-lg font-semibold text-neutral-900">
        {{ title ?? 'Are you sure?' }}
      </h3>

      <div class="mt-2 text-sm text-neutral-600">
        <slot />
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-md border border-neutral-300 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
          @click="onCancel"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          :class="['rounded-md px-4 py-2 font-medium text-white', tone.btn]"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
