<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDialogFooter',
  });
</script>

<template>
  <div
    data-slot="dialog-footer"
    class=":uno: border-border flex min-h-12 items-center justify-end gap-4 border-t-2 px-4 py-2"
  >
    <slot />
  </div>
</template>
