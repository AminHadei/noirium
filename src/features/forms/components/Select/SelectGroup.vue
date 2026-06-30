<script setup lang="ts">
  defineOptions({
    name: 'NoiriumSelectGroup',
  });
</script>

<template>
  <div
    role="group"
    data-slot="select-group"
    class=":uno: scroll-my-1 p-1"
  >
    <slot />
  </div>
</template>
