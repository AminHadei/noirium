<script setup lang="ts">
  import { provide, ref } from 'vue';

  import { menuContextKey } from './menu.context';

  defineOptions({
    name: 'NoiriumMenu',
  });

  const open = defineModel<boolean>('open', { default: false });
  const triggerEl = ref<HTMLElement | null>(null);

  provide(menuContextKey, {
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
