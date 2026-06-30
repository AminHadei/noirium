<script setup lang="ts">
  import { computed, inject, provide, toRef } from 'vue';

  import { accordionContextKey, accordionItemKey } from './accordion.context';

  defineOptions({
    name: 'NoiriumAccordionItem',
  });

  const { value } = defineProps<{
    value: string;
  }>();

  provide(accordionItemKey, { value: toRef(() => value) });

  const context = inject(accordionContextKey);
  const open = computed(() => context?.isOpen(value) ?? false);
</script>

<template>
  <div
    data-slot="accordion-item"
    :data-open="open ? '' : undefined"
    class=":uno: border-border bg-surface text-text-dark overflow-hidden rounded-lg border-1 transition-colors"
  >
    <slot />
  </div>
</template>
