<script setup lang="ts">
  defineOptions({
    name: 'NoiriumPopoverTitle',
  });
</script>

<template>
  <p
    data-slot="popover-title"
    class=":uno: font-figtree text-text-dark text-base font-semibold"
  >
    <slot />
  </p>
</template>
