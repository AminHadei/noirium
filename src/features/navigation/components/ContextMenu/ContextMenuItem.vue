<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { createVariants } from '@/features/shared/lib/utils/variants.util';

  import { contextMenuContextKey } from './context-menu.context';

  defineOptions({
    name: 'NoiriumContextMenuItem',
  });

  const {
    disabled = false,
    variant = 'default',
    closeOnSelect = true,
  } = defineProps<{
    disabled?: boolean;
    variant?: 'default' | 'destructive';
    closeOnSelect?: boolean;
  }>();

  const context = inject(contextMenuContextKey);

  const itemVariants = createVariants({
    base: ':uno: relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    variants: {
      variant: {
        default: ':uno: hover:bg-surface-muted',
        destructive: ':uno: text-destructive hover:bg-destructive/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  });

  const itemClass = computed(() => itemVariants({ variant }));

  const onClick = (): void => {
    if (disabled) return;
    if (closeOnSelect) {
      context?.close();
    }
  };
</script>

<template>
  <div
    role="menuitem"
    data-slot="context-menu-item"
    :data-disabled="disabled ? '' : undefined"
    :aria-disabled="disabled || undefined"
    :class="itemClass"
    @click="onClick"
  >
    <slot />
  </div>
</template>
