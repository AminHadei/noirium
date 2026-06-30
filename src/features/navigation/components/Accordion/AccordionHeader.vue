<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { accordionContextKey, accordionItemKey } from './accordion.context';

  defineOptions({
    name: 'NoiriumAccordionHeader',
  });

  const context = inject(accordionContextKey);
  const item = inject(accordionItemKey);

  const open = computed(() => (item ? (context?.isOpen(item.value.value) ?? false) : false));

  const onClick = (): void => {
    if (item) {
      context?.toggle(item.value.value);
    }
  };
</script>

<template>
  <h3 class=":uno: flex">
    <button
      type="button"
      data-slot="accordion-trigger"
      :aria-expanded="open"
      class=":uno: font-figtree text-text-dark focus-visible:outline-text-light flex flex-1 cursor-pointer items-center justify-between px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-none"
      @click="onClick"
    >
      <slot />
      <span
        class=":uno: i-chevron-down size-4 shrink-0 transition-transform duration-200"
        :class="{ ':uno: rotate-180': open }"
      />
    </button>
  </h3>
</template>
