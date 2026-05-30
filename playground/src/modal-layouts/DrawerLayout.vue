<script setup lang="ts">
  import { useModalContext } from 'noirium/ui';

  defineOptions({ name: 'DrawerLayout', inheritAttrs: false });

  const { title, requestClose } = useModalContext();

  const onBackdropClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) requestClose();
  };
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 flex justify-end"
    style="z-index: 100001"
    @click="onBackdropClick"
  >
    <div class="playground-drawer flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 class="m-0 text-lg font-semibold">{{ title ?? 'Drawer' }}</h3>
        <button
          type="button"
          class="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          @click="requestClose"
        >
          ✕
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .playground-drawer {
    animation: playground-slide-in 0.25s ease-out;
  }

  @keyframes playground-slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style>
