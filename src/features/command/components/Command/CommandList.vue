<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCommandList',
  });
</script>

<template>
  <div
    role="listbox"
    data-slot="command-list"
    class=":uno: max-h-80 overflow-y-auto overscroll-contain bg-white"
  >
    <slot />
  </div>
</template>
