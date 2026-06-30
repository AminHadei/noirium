<script setup lang="ts">
  import { computed, provide, ref } from 'vue';

  import { selectContextKey } from './select.context';

  defineOptions({
    name: 'NoiriumSelect',
  });

  const { placeholder = 'Select an option' } = defineProps<{
    placeholder?: string;
  }>();

  const model = defineModel<string>({ default: '' });
  const open = ref(false);
  const triggerEl = ref<HTMLElement | null>(null);
  const labels = ref(new Map<string, string>());

  provide(selectContextKey, {
    modelValue: model,
    open,
    triggerEl,
    placeholder: computed(() => placeholder),
    labels,
    setOpen: (value: boolean): void => {
      open.value = value;
    },
    toggle: (): void => {
      open.value = !open.value;
    },
    select: (value: string): void => {
      model.value = value;
      open.value = false;
    },
    registerLabel: (value: string, label: string): void => {
      labels.value.set(value, label);
    },
  });
</script>

<template>
  <div
    data-slot="select"
    class=":uno: relative inline-block"
  >
    <slot />
  </div>
</template>
