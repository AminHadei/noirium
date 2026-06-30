<script setup lang="ts">
  import { inject, onMounted, useTemplateRef } from 'vue';

  import { menuContextKey } from './menu.context';

  defineOptions({
    name: 'NoiriumMenuTrigger',
  });

  const context = inject(menuContextKey);
  const el = useTemplateRef<HTMLElement>('el');

  onMounted(() => {
    if (context !== undefined && el.value !== null) {
      context.triggerEl.value = el.value;
    }
  });
</script>

<template>
  <span
    ref="el"
    data-slot="menu-trigger"
    class=":uno: inline-flex"
    :aria-expanded="context?.open.value"
    @click="context?.toggle()"
  >
    <slot />
  </span>
</template>
