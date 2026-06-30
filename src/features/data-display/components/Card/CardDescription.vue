<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCardDescription',
  });
</script>

<template>
  <p
    data-slot="card-description"
    class=":uno: text-text-muted text-sm"
  >
    <slot />
  </p>
</template>
