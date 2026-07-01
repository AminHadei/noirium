<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

  import { commandDialogContextKey } from './command-dialog.context';
  import { commandContextKey } from './command.context';

  defineOptions({
    name: 'NoiriumCommandItem',
  });

  const { value = '', disabled = false } = defineProps<{
    value?: string;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    select: [];
  }>();

  const context = inject(commandContextKey);
  const commandDialogContext = inject(commandDialogContextKey, null);
  const el = useTemplateRef<HTMLElement>('el');
  const id = Symbol('command-item');
  const searchable = ref(value);

  const visible = computed(() => context?.matches(searchable.value) ?? true);

  const onSelect = (): void => {
    if (!disabled) {
      emit('select');
      commandDialogContext?.close();
    }
  };

  onMounted(() => {
    searchable.value = `${value} ${el.value?.textContent?.trim() ?? ''}`.trim();
    context?.registerItem(id, searchable.value);
  });

  onBeforeUnmount(() => context?.unregisterItem(id));
</script>

<template>
  <div
    v-show="visible"
    ref="el"
    role="option"
    data-slot="command-item"
    :data-disabled="disabled ? '' : undefined"
    class=":uno: hover:bg-primary relative flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm transition-colors outline-none select-none hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @click="onSelect"
  >
    <slot />
  </div>
</template>
