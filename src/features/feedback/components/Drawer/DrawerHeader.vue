<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDrawerHeader',
  });
</script>

<template>
  <div
    data-slot="drawer-header"
    class=":uno: border-border flex flex-col gap-1 border-b p-4"
  >
    <slot />
  </div>
</template>
