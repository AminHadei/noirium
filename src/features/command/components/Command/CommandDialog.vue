<script setup lang="ts">
  import { provide } from 'vue';

  import { BaseDialog } from '@/features/shared';

  import { commandDialogContextKey } from './command-dialog.context';
  import Command from './Command.vue';

  defineOptions({
    name: 'NoiriumCommandDialog',
  });

  const open = defineModel<boolean>('open', { default: false });

  provide(commandDialogContextKey, {
    close: (): void => {
      open.value = false;
    },
  });
</script>

<template>
  <BaseDialog
    v-model:visible="open"
    width="640px"
    max-width="90vw"
    :show-close-button="false"
    :content-padding="false"
    content-class=":uno: overflow-hidden bg-white p-0"
  >
    <Command class=":uno: rounded-none border-none !bg-white shadow-none">
      <slot />
    </Command>
  </BaseDialog>
</template>
