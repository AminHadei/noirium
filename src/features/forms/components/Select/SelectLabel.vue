<script setup lang="ts">
  defineOptions({
    name: 'NoiriumSelectLabel',
  });
</script>

<template>
  <div
    data-slot="select-label"
    class=":uno: text-text-dark px-2 py-1.5 text-sm font-semibold"
  >
    <slot />
  </div>
</template>
