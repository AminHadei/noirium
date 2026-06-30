<script setup lang="ts">
  import { inject } from 'vue';

  import { drawerContextKey } from './drawer.context';

  defineOptions({
    name: 'NoiriumDrawerTrigger',
  });

  const context = inject(drawerContextKey);
</script>

<template>
  <span
    data-slot="drawer-trigger"
    class=":uno: inline-flex"
    @click="context?.setOpen(true)"
  >
    <slot />
  </span>
</template>
