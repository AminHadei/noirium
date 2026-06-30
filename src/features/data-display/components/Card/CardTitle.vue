<script setup lang="ts">
  import Text from '../Text/Text.vue';

  defineOptions({
    name: 'NoiriumCardTitle',
  });
</script>

<template>
  <Text
    as="h3"
    data-slot="card-title"
    class=":uno: mb-2"
  >
    <slot />
  </Text>
</template>
