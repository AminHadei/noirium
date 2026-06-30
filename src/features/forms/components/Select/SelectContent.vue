<script setup lang="ts">
  import type { Placement } from '@popperjs/core';
  import { onClickOutside, useEventListener } from '@vueuse/core';
  import { inject, ref, useTemplateRef } from 'vue';

  import { usePopper } from '@/features/shared/composables/usePopper';
  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  import { selectContextKey } from './select.context';
  import SelectScrollDownButton from './SelectScrollDownButton.vue';
  import SelectScrollUpButton from './SelectScrollUpButton.vue';

  defineOptions({
    name: 'NoiriumSelectContent',
    inheritAttrs: false,
  });

  const { side = 'bottom', sideOffset = 8 } = defineProps<{
    side?: Placement;
    sideOffset?: number;
  }>();

  const context = inject(selectContextKey);
  const open = context?.open ?? ref(false);
  const triggerEl = context?.triggerEl ?? ref<HTMLElement | null>(null);
  const contentEl = useTemplateRef<HTMLElement>('contentEl');
  const listEl = useTemplateRef<HTMLElement>('listEl');
  const teleportTarget = useTeleportTarget();

  usePopper(triggerEl, contentEl, open, { placement: side, offset: sideOffset });

  onClickOutside(contentEl, () => context?.setOpen(false), { ignore: [triggerEl] });

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open.value) {
      context?.setOpen(false);
    }
  });

  const scrollList = (delta: number): void => {
    listEl.value?.scrollBy({ top: delta, behavior: 'smooth' });
  };
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-select">
      <div
        v-if="open"
        ref="contentEl"
        role="listbox"
        data-slot="select-content"
        class=":uno: border-border bg-surface text-text-dark z-50 flex max-h-60 min-w-[8rem] flex-col overflow-hidden rounded-lg border-1 p-0 shadow-sm outline-none"
        v-bind="$attrs"
      >
        <SelectScrollUpButton @click="scrollList(-48)" />
        <div
          ref="listEl"
          class=":uno: flex-1 overflow-y-auto p-1"
        >
          <slot />
        </div>
        <SelectScrollDownButton @click="scrollList(48)" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-select-enter-active,
  .noirium-select-leave-active {
    transition:
      opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-select-enter-from,
  .noirium-select-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  /* @unocss-skip-end */
</style>
