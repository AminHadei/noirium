<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { togglePressedClasses, toggleVariants } from '../Toggle/toggle.variants';
  import { ToggleGroupContextKey } from './toggle-group.context';

  defineOptions({
    name: 'NoiriumToggleGroupItem',
  });

  const { value, disabled = false } = defineProps<{
    value: string;
    disabled?: boolean;
  }>();

  const context = inject(ToggleGroupContextKey);

  const pressed = computed(() => context?.isSelected(value) ?? false);

  const itemClass = computed(() => [
    toggleVariants({ variant: context?.variant, size: context?.size }),
    pressed.value ? togglePressedClasses[context?.variant ?? 'default'] : '',
  ]);

  const onClick = (): void => {
    if (disabled) return;
    context?.toggle(value);
  };
</script>

<template>
  <button
    type="button"
    :aria-pressed="pressed"
    :disabled="disabled"
    :class="itemClass"
    @click="onClick"
  >
    <slot />
  </button>
</template>
