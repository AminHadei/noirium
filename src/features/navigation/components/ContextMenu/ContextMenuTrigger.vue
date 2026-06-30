<script setup lang="ts">
  import { inject } from 'vue';

  import { contextMenuContextKey } from './context-menu.context';

  defineOptions({
    name: 'NoiriumContextMenuTrigger',
  });

  const context = inject(contextMenuContextKey);

  const onContextMenu = (event: MouseEvent): void => {
    context?.openAt(event.clientX, event.clientY);
  };
</script>

<template>
  <span
    data-slot="context-menu-trigger"
    class=":uno: inline-flex"
    @contextmenu.prevent="onContextMenu"
  >
    <slot />
  </span>
</template>
