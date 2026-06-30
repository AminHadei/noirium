<script setup lang="ts">
  import { onClickOutside, useEventListener } from '@vueuse/core';
  import { computed, inject, useTemplateRef } from 'vue';

  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  import { contextMenuContextKey } from './context-menu.context';

  defineOptions({
    name: 'NoiriumContextMenuContent',
    inheritAttrs: false,
  });

  const context = inject(contextMenuContextKey);
  const contentEl = useTemplateRef<HTMLElement>('contentEl');

  const positionStyle = computed(() => ({
    top: `${context?.y.value ?? 0}px`,
    left: `${context?.x.value ?? 0}px`,
  }));

  onClickOutside(contentEl, () => context?.close());

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && context?.open.value === true) {
      context.close();
    }
  });
  const teleportTarget = useTeleportTarget();
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-context-menu">
      <div
        v-if="context?.open.value"
        ref="contentEl"
        role="menu"
        data-slot="context-menu-content"
        class=":uno: border-border bg-surface text-text-dark fixed z-50 min-w-32 overflow-hidden rounded-lg border-1 p-1 shadow-sm"
        :style="positionStyle"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-context-menu-enter-active,
  .noirium-context-menu-leave-active {
    transition:
      opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-context-menu-enter-from,
  .noirium-context-menu-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  /* @unocss-skip-end */
</style>
