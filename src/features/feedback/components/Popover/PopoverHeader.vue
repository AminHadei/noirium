<script setup lang="ts">
  defineOptions({
    name: 'NoiriumPopoverHeader',
  });
</script>

<template>
  <div
    data-slot="popover-header"
    class=":uno: flex flex-col gap-1 text-sm"
  >
    <slot />
  </div>
</template>
