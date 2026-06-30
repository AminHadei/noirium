<script setup lang="ts">
  defineOptions({
    name: 'NoiriumContextMenuLabel',
  });
</script>

<template>
  <div
    data-slot="context-menu-label"
    class=":uno: text-text-dark px-2 py-1.5 text-sm font-semibold"
  >
    <slot />
  </div>
</template>
