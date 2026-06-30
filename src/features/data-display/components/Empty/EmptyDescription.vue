<script setup lang="ts">
  defineOptions({
    name: 'NoiriumEmptyDescription',
  });
</script>

<template>
  <p
    data-slot="empty-description"
    class=":uno: font-noto text-text-light max-w-xs text-sm"
  >
    <slot />
  </p>
</template>
