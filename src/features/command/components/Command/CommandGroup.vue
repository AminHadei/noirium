<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCommandGroup',
  });

  const { heading = '' } = defineProps<{
    heading?: string;
  }>();
</script>

<template>
  <div
    role="group"
    data-slot="command-group"
    class=":uno: text-text-dark overflow-hidden p-1"
  >
    <div
      v-if="heading !== ''"
      data-slot="command-group-heading"
      class=":uno: text-text-light px-2 py-1.5 text-xs font-medium"
    >
      {{ heading }}
    </div>
    <slot />
  </div>
</template>
