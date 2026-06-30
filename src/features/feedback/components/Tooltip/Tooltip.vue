<script setup lang="ts">
  import { onBeforeUnmount, provide, ref } from 'vue';

  import { tooltipContextKey } from './tooltip.context';

  defineOptions({
    name: 'NoiriumTooltip',
  });

  const { delay = 200 } = defineProps<{
    delay?: number;
  }>();

  const open = ref(false);
  const triggerEl = ref<HTMLElement | null>(null);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const show = (): void => {
    clearTimer();
    timer = setTimeout(() => {
      open.value = true;
    }, delay);
  };

  const hide = (): void => {
    clearTimer();
    open.value = false;
  };

  onBeforeUnmount(clearTimer);

  provide(tooltipContextKey, { open, triggerEl, show, hide });
</script>

<template>
  <slot />
</template>
