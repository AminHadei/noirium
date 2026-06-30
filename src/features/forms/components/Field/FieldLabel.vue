<script setup lang="ts">
  defineOptions({
    name: 'NoiriumFieldLabel',
  });

  defineProps<{
    for?: string;
  }>();
</script>

<template>
  <label
    :for="$props.for"
    data-slot="field-label"
    class=":uno: font-figtree text-text-dark flex w-fit gap-2 text-sm leading-snug font-semibold select-none"
  >
    <slot />
  </label>
</template>
