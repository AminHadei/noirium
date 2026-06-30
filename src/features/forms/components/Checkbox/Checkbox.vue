<script setup lang="ts">
  import { computed } from 'vue';

  import { createVariants } from '@/features/shared/lib/utils/variants.util';

  import type { CheckboxSize, CheckboxVariant } from './checkbox.types';

  defineOptions({
    name: 'NoiriumCheckbox',
  });

  const {
    variant = 'default',
    size = 'md',
    disabled = false,
  } = defineProps<{
    variant?: CheckboxVariant;
    size?: CheckboxSize;
    disabled?: boolean;
  }>();

  const model = defineModel<boolean>({ default: false });

  const boxVariants = createVariants({
    base: ':uno: inline-flex shrink-0 items-center justify-center rounded border-1 border-border transition-colors',
    variants: {
      size: {
        sm: ':uno: size-4',
        md: ':uno: size-5',
        lg: ':uno: size-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  });

  const checkedClasses: Record<CheckboxVariant, string> = {
    default: ':uno: bg-primary text-white border-primary',
    outline: ':uno: text-text-dark',
    solid: ':uno: bg-text-darker text-white border-text-darker',
  };

  const boxClass = computed(() => boxVariants({ size }));
  const stateClass = computed(() => (model.value ? checkedClasses[variant] : ''));
</script>

<template>
  <label
    class=":uno: inline-flex cursor-pointer items-center gap-2"
    :class="{ ':uno: cursor-not-allowed opacity-50': disabled }"
  >
    <input
      v-model="model"
      type="checkbox"
      class=":uno: peer sr-only"
      :disabled="disabled"
    />
    <span :class="[boxClass, stateClass]">
      <span
        v-show="model"
        class=":uno: i-check size-full"
      />
    </span>
    <span
      v-if="$slots['default']"
      class=":uno: text-text-dark text-sm"
    >
      <slot />
    </span>
  </label>
</template>
