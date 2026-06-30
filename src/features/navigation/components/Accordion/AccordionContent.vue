<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { accordionContextKey, accordionItemKey } from './accordion.context';

  defineOptions({
    name: 'NoiriumAccordionContent',
  });

  const context = inject(accordionContextKey);
  const item = inject(accordionItemKey);

  const open = computed(() => (item ? (context?.isOpen(item.value.value) ?? false) : false));
</script>

<template>
  <div
    v-show="open"
    data-slot="accordion-content"
    class=":uno: font-noto text-text-light px-4 pt-2 pb-4"
  >
    <slot />
  </div>
</template>
