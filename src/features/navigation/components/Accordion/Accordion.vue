<script setup lang="ts">
  import { provide } from 'vue';

  import { accordionContextKey } from './accordion.context';

  defineOptions({
    name: 'NoiriumAccordion',
  });

  const { type = 'single', collapsible = true } = defineProps<{
    type?: 'single' | 'multiple';
    collapsible?: boolean;
  }>();

  const model = defineModel<string | string[]>({ default: '' });

  const isOpen = (value: string): boolean =>
    Array.isArray(model.value) ? model.value.includes(value) : model.value === value;

  const toggle = (value: string): void => {
    if (type === 'multiple') {
      const current = Array.isArray(model.value) ? [...model.value] : [];
      const index = current.indexOf(value);
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(value);
      }
      model.value = current;
      return;
    }

    const isSame = model.value === value;
    model.value = isSame && collapsible ? '' : value;
  };

  provide(accordionContextKey, { isOpen, toggle });
</script>

<template>
  <div
    data-slot="accordion"
    class=":uno: flex flex-col gap-2"
  >
    <slot />
  </div>
</template>
