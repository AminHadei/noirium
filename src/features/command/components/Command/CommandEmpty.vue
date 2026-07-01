<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { commandContextKey } from './command.context';

  defineOptions({
    name: 'NoiriumCommandEmpty',
  });

  const context = inject(commandContextKey);
  const show = computed(() => (context?.visibleCount.value ?? 0) === 0);
</script>

<template>
  <div
    v-if="show"
    data-slot="command-empty"
    class=":uno: text-text-light py-6 text-center text-sm"
  >
    <slot />
  </div>
</template>
