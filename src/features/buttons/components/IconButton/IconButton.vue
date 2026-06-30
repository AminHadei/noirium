<script setup lang="ts">
  import { computed } from 'vue';

  import type { IconButtonSize, IconButtonVariant } from './icon-button.types';

  defineOptions({
    name: 'NoiriumIconButton',
  });

  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
  } = defineProps<{
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>();

  const buttonClass = computed(() => {
    const base = [
      ':uno: inline-flex cursor-pointer items-center justify-center rounded-full font-noto transition-colors duration-200 focus-visible:outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-text-light',
    ];

    const sizes: Record<IconButtonSize, string> = {
      sm: ':uno: p-1.5',
      md: ':uno: p-2',
      lg: ':uno: p-2.5',
    };

    const variants: Record<IconButtonVariant, string[]> = {
      primary: [':uno: border-none bg-primary text-white hover:bg-text-darker'],
      outline: [
        ':uno: border-1 border-primary bg-transparent text-primary hover:border-text-darker hover:text-text-darker',
      ],
      text: [':uno: border-none bg-transparent text-primary hover:text-text-darker'],
    };

    const disabledStyles: Record<IconButtonVariant, string[]> = {
      primary: [':uno: bg-primary/30 text-white/60 pointer-events-none'],
      outline: [':uno: border-primary/30 text-primary/30 pointer-events-none'],
      text: [':uno: text-primary/30 pointer-events-none'],
    };

    const classes = [
      ...base,
      sizes[size],
      ...(disabled ? disabledStyles[variant] : variants[variant]),
    ];

    return classes;
  });
</script>

<template>
  <button
    :class="buttonClass"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
