<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCommandShortcut',
  });
</script>

<template>
  <span
    data-slot="command-shortcut"
    class=":uno: text-text-light [margin-inline-start:auto] text-xs tracking-widest"
  >
    <slot />
  </span>
</template>
