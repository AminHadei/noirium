<script setup lang="ts">
  import { TABLE_CELL_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableCell',
  });
</script>

<template>
  <td
    :data-slot="TABLE_CELL_SLOT"
    class=":uno: font-noto p-2 align-middle md:p-3 [&:has([role=checkbox])]:pr-0"
  >
    <slot />
  </td>
</template>
