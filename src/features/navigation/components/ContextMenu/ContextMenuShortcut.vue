<script setup lang="ts">
  defineOptions({
    name: 'NoiriumContextMenuShortcut',
  });
</script>

<template>
  <span
    data-slot="context-menu-shortcut"
    class=":uno: text-text-muted ml-auto text-xs tracking-widest"
  >
    <slot />
  </span>
</template>
