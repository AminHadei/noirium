<script setup lang="ts">
  withDefaults(
    defineProps<{
      modelValue?: string | null | undefined;
      label?: string;
      required?: boolean;
      placeholder?: string;
    }>(),
    {
      modelValue: null,
      label: '',
      required: false,
      placeholder: '',
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): [];
  }>();

  const handleInput = (event: Event): void => {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
  };
</script>

<template>
  <div class=":uno: flex flex-col gap-2">
    <label
      v-if="label"
      class=":uno: text-text-darker font-figtree line-height-normal text-sm font-semibold"
    >
      {{ label }}
      <span
        v-if="required"
        class=":uno: text-destructive"
        >*</span
      >
    </label>
    <input
      :placeholder="placeholder"
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      class=":uno: focus-within:border-primary focus-within:ring-primary/20 flex h-10 w-full items-center justify-between rounded-lg border border-border px-5 transition-all focus-within:ring-2 hover:border-border-hover focus-visible:outline-none"
      :value="modelValue"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
