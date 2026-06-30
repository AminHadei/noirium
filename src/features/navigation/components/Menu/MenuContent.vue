<script setup lang="ts">
  import type { Placement } from '@popperjs/core';
  import { onClickOutside, useEventListener } from '@vueuse/core';
  import { inject, ref, useTemplateRef } from 'vue';

  import { usePopper } from '@/features/shared/composables/usePopper';
  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  import { menuContextKey } from './menu.context';

  defineOptions({
    name: 'NoiriumMenuContent',
    inheritAttrs: false,
  });

  const { side = 'bottom', sideOffset = 4 } = defineProps<{
    side?: Placement;
    sideOffset?: number;
  }>();

  const context = inject(menuContextKey);
  const open = context?.open ?? ref(false);
  const triggerEl = context?.triggerEl ?? ref<HTMLElement | null>(null);
  const contentEl = useTemplateRef<HTMLElement>('contentEl');

  usePopper(triggerEl, contentEl, open, { placement: side, offset: sideOffset });

  onClickOutside(contentEl, () => context?.setOpen(false), { ignore: [triggerEl] });

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open.value) {
      context?.setOpen(false);
    }
  });
  const teleportTarget = useTeleportTarget();
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-menu">
      <div
        v-if="open"
        ref="contentEl"
        role="menu"
        data-slot="menu-content"
        class=":uno: border-border bg-surface text-text-dark z-50 min-w-40 overflow-y-auto rounded-lg border-1 p-1 shadow-sm outline-none"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-menu-enter-active,
  .noirium-menu-leave-active {
    transition:
      opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-menu-enter-from,
  .noirium-menu-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  /* @unocss-skip-end */
</style>
