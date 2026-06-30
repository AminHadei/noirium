<script setup lang="ts">
  import { TABLE_HEAD_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableHead',
  });
</script>

<template>
  <th
    :data-slot="TABLE_HEAD_SLOT"
    class=":uno: h-10 px-4 text-left align-middle font-semibold md:h-12 [&:has([role=checkbox])]:pr-0"
  >
    <slot />
  </th>
</template>
