<script setup lang="ts">
  import { provide } from 'vue';

  import type { ToggleSize, ToggleVariant } from '../Toggle/toggle.types';
  import { ToggleGroupContextKey } from './toggle-group.context';

  defineOptions({
    name: 'NoiriumToggleGroup',
  });

  const {
    variant = 'default',
    size = 'default',
    type = 'single',
    orientation = 'horizontal',
  } = defineProps<{
    variant?: ToggleVariant;
    size?: ToggleSize;
    type?: 'single' | 'multiple';
    orientation?: 'horizontal' | 'vertical';
  }>();

  const model = defineModel<string | string[]>();

  const isSelected = (value: string): boolean => {
    if (type === 'multiple') {
      return Array.isArray(model.value) && model.value.includes(value);
    }
    return model.value === value;
  };

  const toggle = (value: string): void => {
    if (type === 'multiple') {
      const current = Array.isArray(model.value) ? model.value : [];
      model.value = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return;
    }
    model.value = model.value === value ? '' : value;
  };

  provide(ToggleGroupContextKey, {
    get variant() {
      return variant;
    },
    get size() {
      return size;
    },
    isSelected,
    toggle,
  });
</script>

<template>
  <div
    class=":uno: flex w-fit items-center gap-1"
    :class="orientation === 'vertical' ? ':uno: flex-col items-stretch' : ''"
    :data-orientation="orientation"
    role="group"
  >
    <slot />
  </div>
</template>
