<script setup lang="ts">
  defineOptions({
    name: 'NoiriumLabel',
  });

  defineProps<{
    for?: string;
  }>();
</script>

<template>
  <label
    :for="$props.for"
    class=":uno: font-figtree text-text-dark text-base leading-normal font-semibold select-none"
  >
    <slot />
  </label>
</template>
