<script setup lang="ts">
  defineOptions({
    name: 'NoiriumSelectScrollDownButton',
  });
</script>

<template>
  <div
    data-slot="select-scroll-down-button"
    class=":uno: text-text-light bg-surface flex cursor-default items-center justify-center py-1"
  >
    <span class=":uno: i-chevron-down size-4" />
  </div>
</template>
