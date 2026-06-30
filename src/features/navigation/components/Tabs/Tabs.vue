<script setup lang="ts">
  import { provide, ref, watch } from 'vue';

  import { tabsContextKey } from './tabs.context';

  defineOptions({
    name: 'NoiriumTabs',
  });

  const { defaultValue = '' } = defineProps<{
    defaultValue?: string;
  }>();

  const model = defineModel<string>({ default: '' });

  const active = ref(model.value === '' ? defaultValue : model.value);

  watch(model, (value) => {
    if (value !== '' && value !== active.value) {
      active.value = value;
    }
  });

  const setActive = (value: string): void => {
    active.value = value;
    model.value = value;
  };

  provide(tabsContextKey, { active, setActive });
</script>

<template>
  <div data-slot="tabs">
    <slot />
  </div>
</template>
