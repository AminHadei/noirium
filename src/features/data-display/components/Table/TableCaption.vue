<script setup lang="ts">
  import { TABLE_CAPTION_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableCaption',
  });
</script>

<template>
  <caption
    :data-slot="TABLE_CAPTION_SLOT"
    class=":uno: text-text-muted my-2 text-sm"
  >
    <slot />
  </caption>
</template>
