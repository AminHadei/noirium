<script setup lang="ts">
  import { useEventListener } from '@vueuse/core';
  import { computed, inject } from 'vue';

  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  import { drawerContextKey, type DrawerDirection } from './drawer.context';

  defineOptions({
    name: 'NoiriumDrawerContent',
    inheritAttrs: false,
  });

  const context = inject(drawerContextKey);

  const direction = computed<DrawerDirection>(() => context?.direction.value ?? 'right');

  const panelClasses: Record<DrawerDirection, string> = {
    top: ':uno: inset-x-0 top-0 max-h-[80vh] rounded-b-lg border-b',
    bottom: ':uno: inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg border-t',
    left: ':uno: inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    right: ':uno: inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
  };

  const panelClass = computed(() => panelClasses[direction.value]);
  const panelEnterName = computed(() => `noirium-drawer-${direction.value}`);
  const teleportTarget = useTeleportTarget();

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && context?.open.value === true) {
      context.close();
    }
  });
</script>

<template>
  <Teleport :to="teleportTarget">
    <Transition name="noirium-drawer-fade">
      <div
        v-if="context?.open.value"
        class=":uno: fixed inset-0 z-50 bg-black/40"
        @click="context?.close()"
      />
    </Transition>
    <Transition :name="panelEnterName">
      <div
        v-if="context?.open.value"
        data-slot="drawer-content"
        role="dialog"
        aria-modal="true"
        :class="[
          ':uno: border-border bg-surface text-text-dark fixed z-50 flex flex-col shadow-sm',
          panelClass,
        ]"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-drawer-fade-enter-active,
  .noirium-drawer-fade-leave-active {
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-drawer-fade-enter-from,
  .noirium-drawer-fade-leave-to {
    opacity: 0;
  }

  .noirium-drawer-right-enter-active,
  .noirium-drawer-right-leave-active,
  .noirium-drawer-left-enter-active,
  .noirium-drawer-left-leave-active,
  .noirium-drawer-top-enter-active,
  .noirium-drawer-top-leave-active,
  .noirium-drawer-bottom-enter-active,
  .noirium-drawer-bottom-leave-active {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .noirium-drawer-right-enter-from,
  .noirium-drawer-right-leave-to {
    transform: translateX(100%);
  }

  .noirium-drawer-left-enter-from,
  .noirium-drawer-left-leave-to {
    transform: translateX(-100%);
  }

  .noirium-drawer-top-enter-from,
  .noirium-drawer-top-leave-to {
    transform: translateY(-100%);
  }

  .noirium-drawer-bottom-enter-from,
  .noirium-drawer-bottom-leave-to {
    transform: translateY(100%);
  }
  /* @unocss-skip-end */
</style>
