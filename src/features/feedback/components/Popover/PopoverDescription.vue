<script setup lang="ts">
  defineOptions({
    name: 'NoiriumPopoverDescription',
  });
</script>

<template>
  <p
    data-slot="popover-description"
    class=":uno: text-text-muted text-sm"
  >
    <slot />
  </p>
</template>
