<script setup lang="ts">
  import { inject, onMounted, useTemplateRef } from 'vue';

  import { selectContextKey } from './select.context';

  defineOptions({
    name: 'NoiriumSelectTrigger',
  });

  const context = inject(selectContextKey);
  const el = useTemplateRef<HTMLButtonElement>('el');

  onMounted(() => {
    if (context !== undefined && el.value !== null) {
      context.triggerEl.value = el.value;
    }
  });
</script>

<template>
  <button
    ref="el"
    type="button"
    data-slot="select-trigger"
    :aria-expanded="context?.open.value ?? false"
    :data-state="(context?.open.value ?? false) ? 'open' : 'closed'"
    class=":uno: form-main-input text-text-dark flex h-10 min-w-40 items-center justify-between gap-2 rounded-lg px-5 py-2 disabled:cursor-not-allowed disabled:opacity-50"
    @click="context?.toggle()"
  >
    <slot />
    <span
      class=":uno: i-chevron-down text-text-light size-4 shrink-0 transition-transform"
      :class="(context?.open.value ?? false) ? ':uno: rotate-180' : ''"
    />
  </button>
</template>
