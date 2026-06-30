<script setup lang="ts">
  import { TABLE_BODY_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableBody',
  });
</script>

<template>
  <tbody
    :data-slot="TABLE_BODY_SLOT"
    class=":uno: [&_tr:last-child]:border-0"
  >
    <slot />
  </tbody>
</template>
