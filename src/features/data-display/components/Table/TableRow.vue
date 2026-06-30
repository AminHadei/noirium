<script setup lang="ts">
  import { TABLE_ROW_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableRow',
  });
</script>

<template>
  <tr
    :data-slot="TABLE_ROW_SLOT"
    class=":uno: border-border hover:bg-surface-muted data-[state=selected]:bg-surface-muted border-b transition-colors"
  >
    <slot />
  </tr>
</template>
