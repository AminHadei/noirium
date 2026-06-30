<script setup lang="ts">
  import Text from '../Text/Text.vue';

  defineOptions({
    name: 'NoiriumEmptyTitle',
  });
</script>

<template>
  <Text
    as="h3"
    data-slot="empty-title"
    class=":uno: font-semibold"
  >
    <slot />
  </Text>
</template>
