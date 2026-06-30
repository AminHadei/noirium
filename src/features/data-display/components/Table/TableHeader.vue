<script setup lang="ts">
  import { TABLE_HEADER_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTableHeader',
  });
</script>

<template>
  <thead
    :data-slot="TABLE_HEADER_SLOT"
    class=":uno: bg-surface-muted text-text-dark font-figtree [&_tr]:border-border [&_tr]:border-b"
  >
    <slot />
  </thead>
</template>
