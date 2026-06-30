<script setup lang="ts">
  import type { Placement } from '@popperjs/core';
  import { computed, inject, ref, useTemplateRef } from 'vue';

  import { usePopper } from '@/features/shared/composables/usePopper';
  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  import { tooltipContextKey } from './tooltip.context';
  import type { TooltipVariant } from './tooltip.types';

  defineOptions({
    name: 'NoiriumTooltipContent',
    inheritAttrs: false,
  });

  const {
    variant = 'default',
    side = 'top',
    sideOffset = 6,
  } = defineProps<{
    variant?: TooltipVariant;
    side?: Placement;
    sideOffset?: number;
  }>();

  const context = inject(tooltipContextKey);
  const open = context?.open ?? ref(false);
  const triggerEl = context?.triggerEl ?? ref<HTMLElement | null>(null);
  const contentEl = useTemplateRef<HTMLElement>('contentEl');

  usePopper(triggerEl, contentEl, open, { placement: side, offset: sideOffset });

  const teleportTarget = useTeleportTarget();

  const contentClass = computed(() => {
    const base = ':uno: z-50 overflow-hidden rounded-lg border-1 px-3 py-1.5 text-xs shadow-sm';

    const variantMap: Record<TooltipVariant, string> = {
      default: ':uno: border-border bg-surface text-text-dark',
      primary: ':uno: border-primary bg-primary text-white',
      solid: ':uno: border-text-darker bg-text-darker text-white',
    };

    return [base, variantMap[variant]];
  });
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-tooltip">
      <div
        v-if="open"
        ref="contentEl"
        role="tooltip"
        data-slot="tooltip-content"
        :class="contentClass"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-tooltip-enter-active,
  .noirium-tooltip-leave-active {
    transition:
      opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-tooltip-enter-from,
  .noirium-tooltip-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  /* @unocss-skip-end */
</style>
