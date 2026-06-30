<script setup lang="ts">
  import { provide } from 'vue';

  import { dialogContextKey } from './dialog.context';

  defineOptions({
    name: 'NoiriumDialog',
  });

  const open = defineModel<boolean>('open', { default: false });

  const setOpen = (value: boolean): void => {
    open.value = value;
  };

  provide(dialogContextKey, {
    open,
    setOpen,
    close: (): void => setOpen(false),
  });
</script>

<template>
  <slot />
</template>
