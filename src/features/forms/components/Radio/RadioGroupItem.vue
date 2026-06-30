<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { createVariants } from '@/features/shared/lib/utils/variants.util';

  import { RadioGroupContextKey } from './radio-group.context';
  import type { RadioSize, RadioVariant } from './radio.types';

  defineOptions({
    name: 'NoiriumRadioGroupItem',
  });

  const { value, disabled = false } = defineProps<{
    value: string;
    disabled?: boolean;
  }>();

  const context = inject(RadioGroupContextKey);

  const variant = computed<RadioVariant>(() => context?.variant ?? 'default');
  const size = computed<RadioSize>(() => context?.size ?? 'md');
  const selected = computed(() => context?.isSelected(value) ?? false);
  const isDisabled = computed(() => disabled || (context?.disabled ?? false));

  const outerVariants = createVariants({
    base: ':uno: inline-flex shrink-0 items-center justify-center rounded-full border-1 border-border',
    variants: {
      size: {
        sm: ':uno: size-4',
        md: ':uno: size-5',
        lg: ':uno: size-6',
      },
    },
    defaultVariants: { size: 'md' },
  });

  const indicatorVariants = createVariants({
    base: ':uno: rounded-full',
    variants: {
      variant: {
        default: ':uno: bg-primary',
        outline: ':uno: border-1 border-primary bg-transparent',
        solid: ':uno: bg-primary',
      },
      size: {
        sm: ':uno: size-2',
        md: ':uno: size-2.5',
        lg: ':uno: size-3.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  });

  const outerClass = computed(() => outerVariants({ size: size.value }));
  const indicatorClass = computed(() =>
    indicatorVariants({ variant: variant.value, size: size.value }),
  );

  const onSelect = (): void => {
    if (isDisabled.value) return;
    context?.select(value);
  };
</script>

<template>
  <label
    class=":uno: inline-flex cursor-pointer items-center"
    :class="{ ':uno: cursor-not-allowed opacity-50': isDisabled }"
  >
    <input
      type="radio"
      class=":uno: peer sr-only"
      :name="context?.name"
      :value="value"
      :checked="selected"
      :disabled="isDisabled"
      @change="onSelect"
    />
    <span :class="outerClass">
      <span
        v-show="selected"
        :class="indicatorClass"
      />
    </span>
  </label>
</template>
