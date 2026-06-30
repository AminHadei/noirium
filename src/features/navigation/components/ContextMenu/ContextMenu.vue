<script setup lang="ts">
  import { provide, ref } from 'vue';

  import { contextMenuContextKey } from './context-menu.context';

  defineOptions({
    name: 'NoiriumContextMenu',
  });

  const open = ref(false);
  const x = ref(0);
  const y = ref(0);

  provide(contextMenuContextKey, {
    open,
    x,
    y,
    openAt: (clientX: number, clientY: number): void => {
      x.value = clientX;
      y.value = clientY;
      open.value = true;
    },
    close: (): void => {
      open.value = false;
    },
  });
</script>

<template>
  <slot />
</template>
