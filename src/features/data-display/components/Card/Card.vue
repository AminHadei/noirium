<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCard',
  });
</script>

<template>
  <div
    data-slot="card"
    class=":uno: border-border bg-surface text-text-dark inline-block rounded-lg border-1 shadow-sm"
  >
    <slot />
  </div>
</template>
