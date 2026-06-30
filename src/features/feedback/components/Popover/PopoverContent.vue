<script setup lang="ts">
  import type { Placement } from '@popperjs/core';
  import { onClickOutside } from '@vueuse/core';
  import { inject, ref, useTemplateRef } from 'vue';

  import { usePopper } from '@/features/shared/composables/usePopper';
  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  import { popoverContextKey } from './popover.context';

  defineOptions({
    name: 'NoiriumPopoverContent',
    inheritAttrs: false,
  });

  const { side = 'bottom', sideOffset = 8 } = defineProps<{
    side?: Placement;
    sideOffset?: number;
  }>();

  const context = inject(popoverContextKey);
  const open = context?.open ?? ref(false);
  const triggerEl = context?.triggerEl ?? ref<HTMLElement | null>(null);
  const contentEl = useTemplateRef<HTMLElement>('contentEl');

  usePopper(triggerEl, contentEl, open, { placement: side, offset: sideOffset });
  const teleportTarget = useTeleportTarget();

  onClickOutside(
    contentEl,
    () => {
      context?.setOpen(false);
    },
    { ignore: [triggerEl] },
  );
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-popover">
      <div
        v-if="open"
        ref="contentEl"
        data-slot="popover-content"
        class=":uno: border-border bg-surface text-text-dark z-50 w-72 rounded-lg border-1 p-4 shadow-sm focus-visible:outline-none"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-popover-enter-active,
  .noirium-popover-leave-active {
    transition:
      opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-popover-enter-from,
  .noirium-popover-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  /* @unocss-skip-end */
</style>
