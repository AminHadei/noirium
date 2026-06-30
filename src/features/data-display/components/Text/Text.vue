<script setup lang="ts">
  import { computed } from 'vue';

  import { TEXT_HEADING_H1, TEXT_HEADING_H5 } from '@/features/shared/composables/scan-safe.util';

  import type { TextAs } from './text.types';

  defineOptions({
    name: 'NoiriumText',
  });

  const { as = 'p' } = defineProps<{
    as?: TextAs;
  }>();

  const textClass = computed(() => {
    switch (as) {
      case 'p':
        return ':uno: font-noto text-base text-text-dark';
      case 'li':
        return ':uno: font-noto text-base text-text-dark';
      case 'a':
        return ':uno: font-noto text-base text-primary underline-offset-2 hover:underline';
      case TEXT_HEADING_H1:
        return ':uno: font-figtree text-4xl font-semibold text-text-darker';
      case 'h2':
        return ':uno: font-figtree text-3xl font-semibold text-text-darker';
      case 'h3':
        return ':uno: font-figtree text-2xl font-semibold text-text-darker';
      case 'h4':
        return ':uno: font-figtree text-xl font-medium text-text-darker';
      case TEXT_HEADING_H5:
        return ':uno: font-figtree text-lg font-medium text-text-darker';
      case 'h6':
        return ':uno: font-figtree text-base font-medium text-text-darker';
      default:
        return ':uno: font-noto text-base text-text-dark';
    }
  });
</script>

<template>
  <component
    :is="as"
    :class="textClass"
  >
    <slot />
  </component>
</template>
