<script setup lang="ts">
  import { TABLE_ELEMENT, TABLE_SLOT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumTable',
    inheritAttrs: false,
  });
</script>

<template>
  <div class=":uno: border-border relative h-full w-full overflow-auto rounded-lg border-1">
    <component
      :is="TABLE_ELEMENT"
      :data-slot="TABLE_SLOT"
      class=":uno: text-text-dark w-full caption-bottom text-sm"
      v-bind="$attrs"
    >
      <slot />
    </component>
  </div>
</template>
