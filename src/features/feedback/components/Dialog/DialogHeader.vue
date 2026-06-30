<script setup lang="ts">
  import { inject } from 'vue';

  import { dialogContextKey } from './dialog.context';

  defineOptions({
    name: 'NoiriumDialogHeader',
  });

  const { closable = true } = defineProps<{
    closable?: boolean;
  }>();

  const context = inject(dialogContextKey);
</script>

<template>
  <div
    data-slot="dialog-header"
    class=":uno: border-border bg-surface-muted text-text-darker flex min-h-12 shrink-0 items-center justify-between gap-4 border-b px-4 py-3"
  >
    <slot />
    <button
      v-if="closable"
      type="button"
      aria-label="Close"
      class=":uno: inline-flex cursor-pointer items-center"
      @click="context?.close()"
    >
      <span class=":uno: i-x size-5" />
    </button>
  </div>
</template>
