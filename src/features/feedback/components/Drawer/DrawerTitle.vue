<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDrawerTitle',
  });
</script>

<template>
  <h2
    data-slot="drawer-title"
    class=":uno: font-figtree text-text-dark text-xl font-semibold"
  >
    <slot />
  </h2>
</template>
