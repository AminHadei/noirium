<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDialogTitle',
  });
</script>

<template>
  <h2
    data-slot="dialog-title"
    class=":uno: font-figtree text-text-darker m-0 text-lg font-semibold"
  >
    <slot />
  </h2>
</template>
