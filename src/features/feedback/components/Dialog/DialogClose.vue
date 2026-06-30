<script setup lang="ts">
  import { inject } from 'vue';

  import { dialogContextKey } from './dialog.context';

  defineOptions({
    name: 'NoiriumDialogClose',
  });

  const context = inject(dialogContextKey);
</script>

<template>
  <span
    data-slot="dialog-close"
    class=":uno: inline-flex"
    @click="context?.close()"
  >
    <slot />
  </span>
</template>
