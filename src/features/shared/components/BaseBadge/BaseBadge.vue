<script setup lang="ts">
  import { computed, type CSSProperties } from 'vue';

  import type { BaseBadgeColor } from './base-badge.types';

  export type { BaseBadgeColor };

  const PRESET_VARIANTS: Record<Exclude<BaseBadgeColor, 'custom'>, string> = {
    red: ':uno: bg-status-badge-red-bg text-status-badge-red-text',
    green: ':uno: bg-status-badge-green-bg text-status-badge-green-text',
    white: ':uno: bg-white text-text-darker border border-border',
    gray: ':uno: bg-surface text-text-dark',
    black: ':uno: bg-primary text-white',
  };

  const props = withDefaults(
    defineProps<{
      color?: BaseBadgeColor;
      /** Background when `color="custom"`. Any valid CSS color (hex, rgb, named). */
      customBackground?: string;
      /** Label color when `color="custom"`. Any valid CSS color (hex, rgb, named). */
      customText?: string;
    }>(),
    {
      color: 'red',
    },
  );

  const usesCustomColors = computed(
    () => props.color === 'custom' && !!(props.customBackground || props.customText),
  );

  const badgeVariantClasses = computed(() => {
    if (usesCustomColors.value) {
      return '';
    }

    if (props.color === 'custom') {
      return PRESET_VARIANTS.gray;
    }

    return PRESET_VARIANTS[props.color];
  });

  const customPresetFillClasses = computed(() => {
    if (!usesCustomColors.value) {
      return '';
    }

    const parts: string[] = [];
    if (!props.customBackground) {
      parts.push('bg-surface');
    }
    if (!props.customText) {
      parts.push('text-text-dark');
    }
    return parts.join(' ');
  });

  const customStyle = computed((): CSSProperties | undefined => {
    if (!usesCustomColors.value) {
      return undefined;
    }

    return {
      ...(props.customBackground ? { backgroundColor: props.customBackground } : {}),
      ...(props.customText ? { color: props.customText } : {}),
    };
  });
</script>

<template>
  <div
    class=":uno: font-noto inline-flex items-center justify-center rounded-full px-3 py-1 text-xs leading-none font-semibold"
    :class="[badgeVariantClasses, customPresetFillClasses]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>
