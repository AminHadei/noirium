<script setup lang="ts">
  import { DatePicker } from 'v-calendar';
  import { computed } from 'vue';

  import 'v-calendar/style.css';
  import type { DatePickerModel, PopoverOptions } from '@/features/shared/lib/types';

  interface DatePickerProps {
    modelValue?: DatePickerModel;
    popover?: Partial<PopoverOptions>;
    mode?: 'date' | 'dateTime' | 'time';
    isRequired?: boolean;
    disabledDates?: ({ start: Date | null; end: Date | null } | null)[];
  }

  const props = withDefaults(defineProps<DatePickerProps>(), {
    modelValue: () => new Date(),
    mode: 'date',
    isRequired: false,
    disabledDates: () => [],
    popover: () => ({}),
  });

  defineEmits<{
    'update:modelValue': [value: Date];
  }>();

  // @unocss-skip-start
  // In Shadow DOM (web component build), Popper.js uses position:absolute but calculates
  // coordinates relative to the viewport. Inside a shadow root the offset parent is the
  // shadow host — not document.body — so the transforms are off by the host's page offset.
  // Forcing positionFixed:true switches Popper.js to strategy:'fixed', which aligns with
  // getBoundingClientRect() viewport coordinates and positions correctly in any context.
  // @unocss-skip-end
  const resolvedPopover = computed(() => {
    return { ...props.popover, positionFixed: true };
  });
</script>

<template>
  <DatePicker
    :model-value="modelValue"
    class=":uno: noirium-datepicker"
    borderless
    :mode="mode"
    :is-required="isRequired"
    :disabled-dates="disabledDates"
    :popover="resolvedPopover"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template
      v-if="$slots['default']"
      #default="slotProps"
    >
      <slot v-bind="slotProps" />
    </template>
  </DatePicker>
</template>

<style>
  .noirium-datepicker .vc-blue {
    --vc-accent-600: #171717;
  }
  .noirium-datepicker {
    --vc-font-family: 'Noto Sans', sans-serif;
  }
</style>
