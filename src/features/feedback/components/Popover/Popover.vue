<script setup lang="ts">
  import { provide, ref } from 'vue';

  import { popoverContextKey } from './popover.context';

  defineOptions({
    name: 'NoiriumPopover',
  });

  const open = defineModel<boolean>('open', { default: false });
  const triggerEl = ref<HTMLElement | null>(null);

  provide(popoverContextKey, {
    open,
    triggerEl,
    setOpen: (value: boolean): void => {
      open.value = value;
    },
    toggle: (): void => {
      open.value = !open.value;
    },
  });
</script>

<template>
  <slot />
</template>
