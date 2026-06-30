<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCardContent',
  });
</script>

<template>
  <div
    data-slot="card-content"
    class=":uno: p-4"
  >
    <slot />
  </div>
</template>
