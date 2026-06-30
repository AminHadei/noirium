<script setup lang="ts">
  defineOptions({
    name: 'NoiriumEmptyContent',
  });
</script>

<template>
  <div
    data-slot="empty-content"
    class=":uno: flex flex-col items-center gap-3"
  >
    <slot />
  </div>
</template>
