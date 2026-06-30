<script setup lang="ts">
  defineOptions({
    name: 'NoiriumDialogDescription',
  });
</script>

<template>
  <p
    data-slot="dialog-description"
    class=":uno: text-muted-foreground"
  >
    <slot />
  </p>
</template>
