<script setup lang="ts">
  import { provide, toRef } from 'vue';

  import { drawerContextKey, type DrawerDirection } from './drawer.context';

  defineOptions({
    name: 'NoiriumDrawer',
  });

  const { direction = 'right' } = defineProps<{
    direction?: DrawerDirection;
  }>();

  const open = defineModel<boolean>('open', { default: false });

  const setOpen = (value: boolean): void => {
    open.value = value;
  };

  provide(drawerContextKey, {
    open,
    direction: toRef(() => direction),
    setOpen,
    close: (): void => setOpen(false),
  });
</script>

<template>
  <slot />
</template>
