<script setup lang="ts">
  defineOptions({
    name: 'NoiriumSwitch',
  });

  const { disabled = false } = defineProps<{
    disabled?: boolean;
  }>();

  const model = defineModel<boolean>({ default: false });

  const toggle = (): void => {
    if (disabled) return;
    model.value = !model.value;
  };
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    class=":uno: border-border inline-flex h-6 w-11 shrink-0 items-center rounded-full border-1 transition-all disabled:cursor-not-allowed disabled:opacity-50"
    :class="model ? ':uno: bg-primary' : ':uno: bg-surface'"
    @click="toggle"
  >
    <span
      class=":uno: mx-0.5 block size-4 rounded-full bg-white shadow transition-transform"
      :class="model ? ':uno: translate-x-5' : ':uno: translate-x-0'"
    />
  </button>
</template>
