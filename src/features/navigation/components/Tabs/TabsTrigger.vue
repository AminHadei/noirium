<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { TAB_ACCESSIBILITY_ROLE } from '@/features/shared/composables/scan-safe.util';

  import { tabsContextKey } from './tabs.context';

  defineOptions({
    name: 'NoiriumTabsTrigger',
  });

  const { value } = defineProps<{
    value: string;
  }>();

  const context = inject(tabsContextKey);
  const active = computed(() => context?.active.value === value);
</script>

<template>
  <button
    type="button"
    :role="TAB_ACCESSIBILITY_ROLE"
    data-slot="tabs-trigger"
    :aria-selected="active"
    :data-active="active ? '' : undefined"
    class=":uno: font-figtree text-text-dark focus-visible:outline-text-light flex items-center rounded-lg border-1 border-transparent px-4 py-1 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-none"
    :class="active ? ':uno: border-border bg-primary font-semibold text-white' : ''"
    @click="context?.setActive(value)"
  >
    <slot />
  </button>
</template>
