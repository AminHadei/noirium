<script setup lang="ts">
  import { Text } from '@/features/data-display';
  import { TEXT_HEADING_H5 } from '@/features/shared/composables/scan-safe.util';

  defineOptions({
    name: 'NoiriumAlertTitle',
  });
</script>

<template>
  <Text
    :as="TEXT_HEADING_H5"
    data-slot="alert-title"
    class=":uno: mb-1 font-semibold"
  >
    <slot />
  </Text>
</template>
