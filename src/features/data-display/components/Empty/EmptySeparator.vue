<script setup lang="ts">
  defineOptions({
    name: 'NoiriumEmptySeparator',
  });
</script>

<template>
  <div
    role="separator"
    data-slot="empty-separator"
    class=":uno: bg-border h-px w-full"
  />
</template>
