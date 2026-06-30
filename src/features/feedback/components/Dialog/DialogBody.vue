<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDialogBody',
  });
</script>

<template>
  <div
    data-slot="dialog-body"
    class=":uno: min-h-0 flex-1 overflow-y-auto p-4"
  >
    <slot />
  </div>
</template>
