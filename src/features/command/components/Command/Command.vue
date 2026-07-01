<script setup lang="ts">
  import { computed, provide, ref } from 'vue';

  import { commandContextKey } from './command.context';

  defineOptions({
    name: 'NoiriumCommand',
  });

  const search = ref('');
  const items = ref(new Map<symbol, string>());

  const matches = (text: string): boolean => {
    const query = search.value.trim().toLowerCase();
    if (query === '') return true;
    return text.toLowerCase().includes(query);
  };

  const visibleCount = computed(() => {
    let count = 0;
    for (const text of items.value.values()) {
      if (matches(text)) count += 1;
    }
    return count;
  });

  provide(commandContextKey, {
    search,
    visibleCount,
    setSearch: (value: string): void => {
      search.value = value;
    },
    matches,
    registerItem: (id: symbol, text: string): void => {
      items.value.set(id, text);
    },
    unregisterItem: (id: symbol): void => {
      items.value.delete(id);
    },
  });
</script>

<template>
  <div
    data-slot="command"
    class=":uno: bg-surface text-text-dark border-border flex h-full w-full flex-col overflow-hidden rounded-lg border-1 shadow-sm"
  >
    <slot />
  </div>
</template>
