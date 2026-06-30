<script setup lang="ts">
  import { computed } from 'vue';

  import { createVariants } from '@/features/shared/lib/utils/variants.util';

  import type { ButtonSize, ButtonVariant } from './button.types';

  defineOptions({
    name: 'NoiriumButton',
  });

  const {
    variant = 'default',
    size = 'md',
    disabled = false,
    type = 'button',
    href = '',
    to = '',
  } = defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    to?: string | Record<string, unknown>;
  }>();

  const buttonVariants = createVariants({
    base: ':uno: font-noto inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-text-light disabled:cursor-not-allowed disabled:opacity-60',
    variants: {
      variant: {
        default: ':uno: border-none bg-primary text-white hover:bg-text-darker',
        secondary: ':uno: border-1 border-border bg-surface text-text-dark hover:bg-surface-strong',
        outline:
          ':uno: border-1 border-primary bg-transparent text-primary hover:border-text-darker hover:text-text-darker',
        link: ':uno: bg-transparent text-primary underline-offset-4 hover:underline',
        ghost: ':uno: bg-transparent text-text-dark hover:bg-surface',
      },
      size: {
        sm: ':uno: px-3 py-1 text-sm',
        md: ':uno: px-4 py-1.5 text-base',
        lg: ':uno: px-6 py-2 text-lg',
        icon: ':uno: p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  });

  const componentType = computed(() => {
    if (to) return 'router-link';
    if (href) return 'a';
    return 'button';
  });

  const buttonClass = computed(() => buttonVariants({ variant, size }));

  const linkDisabled = computed(() => disabled && componentType.value !== 'button');
</script>

<template>
  <component
    :is="componentType"
    :class="[buttonClass, { ':uno: pointer-events-none opacity-60': linkDisabled }]"
    :disabled="componentType === 'button' ? disabled : undefined"
    :type="componentType === 'button' ? type : undefined"
    :href="componentType === 'a' && !disabled ? href || undefined : undefined"
    :to="componentType === 'router-link' ? to : undefined"
    :aria-disabled="disabled || undefined"
  >
    <slot />
  </component>
</template>
