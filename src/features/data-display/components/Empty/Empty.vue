<script setup lang="ts">
  defineOptions({
    name: 'NoiriumEmpty',
  });
</script>

<template>
  <div
    data-slot="empty"
    class=":uno: border-border bg-surface-muted flex flex-col items-center justify-center rounded-lg border-1 p-6 text-center md:p-10"
  >
    <slot />
  </div>
</template>
