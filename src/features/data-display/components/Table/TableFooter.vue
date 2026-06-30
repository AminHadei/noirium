<script setup lang="ts">
  import { TABLE_FOOTER_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableFooter',
  });
</script>

<template>
  <tfoot
    :data-slot="TABLE_FOOTER_SLOT"
    class=":uno: bg-surface-muted text-text-dark border-border border-t font-medium last:[&>tr]:border-b-0"
  >
    <slot />
  </tfoot>
</template>
