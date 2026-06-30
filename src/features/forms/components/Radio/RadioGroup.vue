<script setup lang="ts">
  import { provide } from 'vue';

  import { RadioGroupContextKey } from './radio-group.context';
  import type { RadioSize, RadioVariant } from './radio.types';

  defineOptions({
    name: 'NoiriumRadioGroup',
  });

  const {
    variant = 'default',
    size = 'md',
    disabled = false,
    name = `noirium-radio-${Math.random().toString(36).slice(2, 9)}`,
  } = defineProps<{
    variant?: RadioVariant;
    size?: RadioSize;
    disabled?: boolean;
    name?: string;
  }>();

  const model = defineModel<string>();

  provide(RadioGroupContextKey, {
    get name() {
      return name;
    },
    get variant() {
      return variant;
    },
    get size() {
      return size;
    },
    get disabled() {
      return disabled;
    },
    isSelected: (value: string): boolean => model.value === value,
    select: (value: string): void => {
      model.value = value;
    },
  });
</script>

<template>
  <div
    class=":uno: grid gap-2"
    role="radiogroup"
  >
    <slot />
  </div>
</template>
