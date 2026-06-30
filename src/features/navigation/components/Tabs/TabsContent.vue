<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { tabsContextKey } from './tabs.context';

  defineOptions({
    name: 'NoiriumTabsContent',
  });

  const { value } = defineProps<{
    value: string;
  }>();

  const context = inject(tabsContextKey);
  const active = computed(() => context?.active.value === value);
</script>

<template>
  <div
    v-show="active"
    role="tabpanel"
    data-slot="tabs-content"
    class=":uno: font-noto text-text-dark mt-2 w-full"
  >
    <slot />
  </div>
</template>
