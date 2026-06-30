<script setup lang="ts">
  import { Text } from '@/features/data-display';

  defineOptions({
    name: 'NoiriumAlertDescription',
  });
</script>

<template>
  <Text
    as="p"
    data-slot="alert-description"
    class=":uno: text-sm"
  >
    <slot />
  </Text>
</template>
