<script setup lang="ts">
  import { inject } from 'vue';

  import { dialogContextKey } from './dialog.context';

  defineOptions({
    name: 'NoiriumDialogTrigger',
  });

  const context = inject(dialogContextKey);
</script>

<template>
  <span
    data-slot="dialog-trigger"
    class=":uno: inline-flex"
    @click="context?.setOpen(true)"
  >
    <slot />
  </span>
</template>
