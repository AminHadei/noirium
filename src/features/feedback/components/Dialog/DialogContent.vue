<script setup lang="ts">
  import { useEventListener } from '@vueuse/core';
  import { computed, inject } from 'vue';

  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';
  import { createVariants } from '@/features/shared/lib/utils/variants.util';

  import { dialogContextKey } from './dialog.context';
  import type { DialogSize } from './dialog.types';

  defineOptions({
    name: 'NoiriumDialogContent',
    inheritAttrs: false,
  });

  const { size = 'auto' } = defineProps<{
    size?: DialogSize;
  }>();

  const context = inject(dialogContextKey);

  const dialogVariants = createVariants({
    base: ':uno: relative z-50 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg border-1 border-border bg-white shadow-sm',
    variants: {
      size: {
        auto: ':uno: max-w-fit',
        sm: ':uno: max-w-sm',
        md: ':uno: max-w-md',
        lg: ':uno: max-w-lg',
        xl: ':uno: max-w-2xl',
      },
    },
    defaultVariants: {
      size: 'auto',
    },
  });

  const contentClass = computed(() => dialogVariants({ size }));
  const teleportTarget = useTeleportTarget();

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && context?.open.value === true) {
      context.close();
    }
  });
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-dialog">
      <div
        v-if="context?.open.value"
        class=":uno: font-figtree fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class=":uno: absolute inset-0 bg-gray-500/75 backdrop-blur-sm"
          @click="context?.close()"
        />
        <div
          role="dialog"
          aria-modal="true"
          :class="contentClass"
          v-bind="$attrs"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-dialog-enter-active,
  .noirium-dialog-leave-active {
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-dialog-enter-from,
  .noirium-dialog-leave-to {
    opacity: 0;
  }
  /* @unocss-skip-end */
</style>
