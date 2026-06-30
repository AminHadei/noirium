<script setup lang="ts">
  import { computed } from 'vue';

  import type { ToggleSize, ToggleVariant } from './toggle.types';
  import { togglePressedClasses, toggleVariants } from './toggle.variants';

  defineOptions({
    name: 'NoiriumToggle',
  });

  const {
    variant = 'default',
    size = 'default',
    disabled = false,
  } = defineProps<{
    variant?: ToggleVariant;
    size?: ToggleSize;
    disabled?: boolean;
  }>();

  const model = defineModel<boolean>({ default: false });

  const toggle = (): void => {
    if (disabled) return;
    model.value = !model.value;
  };

  const toggleClass = computed(() => [
    toggleVariants({ variant, size }),
    model.value ? togglePressedClasses[variant] : '',
  ]);
</script>

<template>
  <button
    type="button"
    :aria-pressed="model"
    :disabled="disabled"
    :class="toggleClass"
    @click="toggle"
  >
    <slot />
  </button>
</template>
