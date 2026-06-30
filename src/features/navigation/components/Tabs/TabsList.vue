<script setup lang="ts">
  defineOptions({
    name: 'NoiriumTabsList',
  });
</script>

<template>
  <div
    role="tablist"
    data-slot="tabs-list"
    class=":uno: flex w-full flex-row gap-2"
  >
    <slot />
  </div>
</template>
