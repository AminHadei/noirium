<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDrawerDescription',
  });
</script>

<template>
  <p
    data-slot="drawer-description"
    class=":uno: text-text-muted text-sm"
  >
    <slot />
  </p>
</template>
