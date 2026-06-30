<script setup lang="ts">
  import { inject } from 'vue';

  import { menuContextKey } from './menu.context';

  defineOptions({
    name: 'NoiriumMenuItem',
  });

  const { disabled = false, closeOnSelect = true } = defineProps<{
    disabled?: boolean;
    closeOnSelect?: boolean;
  }>();

  const context = inject(menuContextKey);

  const onClick = (): void => {
    if (disabled) return;
    if (closeOnSelect) {
      context?.setOpen(false);
    }
  };
</script>

<template>
  <div
    role="menuitem"
    data-slot="menu-item"
    :data-disabled="disabled ? '' : undefined"
    :aria-disabled="disabled || undefined"
    class=":uno: hover:bg-surface-muted relative flex cursor-default items-center rounded-md px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @click="onClick"
  >
    <slot />
  </div>
</template>
