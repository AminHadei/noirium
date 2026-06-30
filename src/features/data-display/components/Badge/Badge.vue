<script setup lang="ts">
  import { computed } from 'vue';

  import { createVariants } from '@/features/shared/lib/utils/variants.util';

  import type { BadgeSize, BadgeVariant } from './badge.types';

  defineOptions({
    name: 'NoiriumBadge',
  });

  const { variant = 'default', size = 'md' } = defineProps<{
    variant?: BadgeVariant;
    size?: BadgeSize;
  }>();

  const badgeVariants = createVariants({
    base: ':uno: font-noto inline-flex items-center rounded-full font-semibold',
    variants: {
      variant: {
        default: ':uno: bg-surface text-text-dark',
        outline: ':uno: border-1 border-border text-text-dark',
        solid: ':uno: bg-primary text-white',
        surface: ':uno: border-1 border-primary bg-surface text-primary',
      },
      size: {
        sm: ':uno: px-2 py-0.5 text-xs',
        md: ':uno: px-3 py-1 text-xs',
        lg: ':uno: px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  });

  const badgeClass = computed(() => badgeVariants({ variant, size }));
</script>

<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>
