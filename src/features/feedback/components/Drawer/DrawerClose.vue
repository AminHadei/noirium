<script setup lang="ts">
  import { inject } from 'vue';

  import { drawerContextKey } from './drawer.context';

  defineOptions({
    name: 'NoiriumDrawerClose',
  });

  const context = inject(drawerContextKey);
</script>

<template>
  <span
    data-slot="drawer-close"
    class=":uno: inline-flex"
    @click="context?.close()"
  >
    <slot />
  </span>
</template>
