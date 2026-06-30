<script setup lang="ts">
  defineOptions({
    name: 'NoiriumField',
  });
</script>

<template>
  <div
    data-slot="field"
    class=":uno: grid gap-1.5"
  >
    <slot />
  </div>
</template>
